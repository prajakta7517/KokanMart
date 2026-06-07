from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.order import OrderCreate
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()
@router.post("/create")
async def create_order(order: OrderCreate, user=Depends(get_current_user)):
    
    total_amount = 0
    validated_items = []

    for item in order.items:
        product = await db["products"].find_one({"_id": ObjectId(item.product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found") 
        if product["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product['name']}")
        
        real_subtotal = product["price_per_unit"] * item.quantity
        total_amount += real_subtotal
        
        validated_items.append({
            "product_id": item.product_id,
            "product_name": product["name"],         
            "quantity": item.quantity,
            "unit": product["unit"],
            "price_per_unit": product["price_per_unit"], 
            "subtotal": real_subtotal                
        })
    
    order_dict = {
        "user_id":      str(user["_id"]),
        "address":      order.address,
        "items":        validated_items,
        "total_amount": total_amount,
        "status":       "pending",
        "notes":        order.notes,
        "created_at":   datetime.utcnow()
    }
    
    result = await db["orders"].insert_one(order_dict)
    return {
        "message": "Order placed successfully!",
        "order_id": str(result.inserted_id),
        "total_amount": total_amount
    }
    
    
@router.get("/my_orders")
async def get_my_orders(user=Depends(get_current_user)):
    orders = await db["orders"].find(
        {"user_id": str(user["_id"])}).to_list(length=100)
    
    for o in orders:
        o["id"] = str(o["_id"])
        del o["_id"]
    
    return {"orders": orders}

@router.get("/get_order/{order_id}")
async def get_order(order_id: str, user=Depends(get_current_user)):
    try:
        obj_id = ObjectId(order_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    order = await db["orders"].find_one({"_id": obj_id, "user_id": str(user["_id"])})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["id"] = str(order["_id"])
    del order["_id"]
    return {"order": order}

@router.get("/all_orders")
async def get_all_orders(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can view all orders!")

    orders = await db["orders"].find().sort("created_at", -1).to_list(length=200)

    for o in orders:
        o["id"] = str(o["_id"])
        del o["_id"]

    return {"orders": orders}


@router.put("/update_status/{order_id}")
async def update_order_status(
    order_id: str,
    status: str,
    user=Depends(get_current_user)
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update order status!")

    valid_statuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status! Choose from: {valid_statuses}")

    try:
        obj_id = ObjectId(order_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    result = await db["orders"].update_one({"_id": obj_id},{"$set": {"status": status,"updated_at": datetime.utcnow()}})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"message": f"Order status updated to '{status}' successfully!"}