from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.order import OrderCreate
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId

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