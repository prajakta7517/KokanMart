from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.products import ProductCreate
from utils.auth import required_role
from datetime import datetime

router = APIRouter()
@router.post("/create_product")
async def create_product(
    product: ProductCreate,
    user=Depends(required_role("admin"))
):
    
    existing_product = await db["products"].find_one({"name": product.name})
    if existing_product:
        raise HTTPException(status_code=400, detail="Product already exists")

   
    product_dict = product.model_dump()
    product_dict["is_available"] = True
    product_dict["created_at"] = datetime.utcnow()

    
    result = await db["products"].insert_one(product_dict)

    
    created_product = await db["products"].find_one({"_id": result.inserted_id})

    
    created_product["id"] = str(created_product["_id"])
    del created_product["_id"]

    return {
        "message": "Product created successfully!",
        "product": created_product
    }
