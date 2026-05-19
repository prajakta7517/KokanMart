from fastapi import APIRouter, HTTPException
from database import db
from models.user import UserCreate , UserLogin
from utils.auth import create_access_token, hash_password, verify_password

router = APIRouter()

@router.post("/signup")
async def signup(user:UserCreate):
    
    existing_user= await db["users"].find_one({"email":user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    user_dict= user.dict( )
    user_dict["password"]= hashed
    
    result= await db["users"].insert_one(user_dict)
    return {
        "message": "Registration successful!",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(user:UserLogin):
    existing_user= await db["users"].find_one({"email":user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    
    token = create_access_token({"sub": str(existing_user["_id"]), "role": existing_user["role"]})
    
    return {
        "message": "Login successful!",
        "access_token": token,
        "token_type": "bearer"
    }