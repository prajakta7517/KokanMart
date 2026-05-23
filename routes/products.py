from fastapi import APIRouter, Depends, HTTPException
from database import db
from models.products import ProductCreate, ProductUpdate
from utils.auth import required_role
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

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

    return {"message": "Product created successfully!", "product": created_product}


@router.get("/get_all_products")
async def get_all_products():
    products = await db["products"].find().to_list(length=100)
    for p in products:
        p["id"] = str(p["_id"])
        del p["_id"]
    return {"products": products}


@router.get("/{product_id}")
async def get_product(product_id: str):
    try:
        obj_id = ObjectId(product_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    product = await db["products"].find_one({"_id": obj_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product["id"] = str(product["_id"])
    del product["_id"]
    return {"product": product}


@router.put("/update_product/{product_id}")
async def update_product(
    product_id: str,
    product: ProductCreate,
    user=Depends(required_role("admin"))
):
    try:
        obj_id = ObjectId(product_id)   
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    existing_product = await db["products"].find_one({"_id": obj_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    updated_data = product.model_dump()
    await db["products"].update_one({"_id": obj_id}, {"$set": updated_data})

    updated_product = await db["products"].find_one({"_id": obj_id})
    updated_product["id"] = str(updated_product["_id"])
    del updated_product["_id"]
    return {"message": "Product updated successfully!", "product": updated_product}


@router.delete("/delete_product/{product_id}")
async def delete_product(
    product_id: str,
    user=Depends(required_role("admin"))
):
    try:
        obj_id = ObjectId(product_id)   
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    existing_product = await db["products"].find_one({"_id": obj_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db["products"].delete_one({"_id": obj_id})
    return {"message": "Product deleted successfully!"}


