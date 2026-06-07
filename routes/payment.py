from fastapi import APIRouter, Depends, HTTPException
from database import db
from utils.auth import get_current_user
from utils.razorpay_client import client
from models.payment import PaymentCreate, PaymentResponse
from datetime import datetime
import os
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()

@router.post("/create")
async def create_payment(order_id: str, user=Depends(get_current_user)):

    try:
        obj_id = ObjectId(order_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    order = await db["orders"].find_one({"_id": obj_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order["user_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not your order!")

  
    razorpay_order = client.order.create({
        "amount": int(order["total_amount"] * 100),
        "currency": "INR",
        "receipt": str(order["_id"]),
        "payment_capture": 1
    })

    payment_dict = {
        "order_id":          str(order["_id"]),
        "user_id":           str(user["_id"]),
        "razorpay_order_id": razorpay_order["id"],
        "amount":            order["total_amount"],
        "currency":          "INR",
        "status":            "pending",
        "created_at":        datetime.utcnow()
    }
    await db["payments"].insert_one(payment_dict)

    return {
        "razorpay_order_id": razorpay_order["id"],
        "amount":            order["total_amount"],
        "currency":          "INR",
        "key_id":            os.getenv("RAZORPAY_KEY_ID")
    }
    
    
    
@router.post("/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    user=Depends(get_current_user)
):
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id":   razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature":  razorpay_signature
        })
    except:
        raise HTTPException(status_code=400, detail="Payment verification failed!")

    await db["payments"].update_one(
        {"razorpay_order_id": razorpay_order_id},
        {"$set": {
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature":  razorpay_signature,
            "status":              "paid"
        }}
    )

    payment = await db["payments"].find_one(
        {"razorpay_order_id": razorpay_order_id}
    )
    await db["orders"].update_one({"_id": ObjectId(payment["order_id"])}, {"$set": {"status": "confirmed","updated_at": datetime.utcnow()}})

    return {"message": "Payment successful! Order confirmed! 🎉"}