from fastapi import APIRouter, HTTPException
from database import db
from models.user import UserCreate , UserLogin
from utils.auth import create_access_token, hash_password, verify_password
from utils.email import send_reset_email
from models.user import ForgotPassword, ResetPassword
import secrets
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/signup")
async def signup(user:UserCreate):
    
    existing_user= await db["users"].find_one({"email":user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed
    user_dict["role"] = "customer"
    user_dict["is_active"] = True           
    user_dict["created_at"] = datetime.utcnow()
    
    result= await db["users"].insert_one(user_dict)
    return {
        "message": "Registration successful!",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(user:UserLogin):
    existing_user= await db["users"].find_one({"email":user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(existing_user["_id"]), "role": existing_user["role"]})
    
    return {
        "message": "Login successful!",
        "access_token": token,
        "token_type": "bearer"
    }
    
    

@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword):
    
    user = await db["users"].find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    token = secrets.token_urlsafe(32)
    
    expiry = datetime.utcnow() + timedelta(minutes=30)
    await db["users"].update_one(
        {"email": data.email},
        {"$set": {
            "reset_token": token,
            "reset_token_expiry": expiry
        }}
    )
    
    await send_reset_email(data.email, token)
    
    return {"message": "Password reset link sent to your email!"}


@router.post("/reset-password")
async def reset_password(data: ResetPassword):
    
    user = await db["users"].find_one({"reset_token": data.token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
   
    if datetime.utcnow() > user["reset_token_expiry"]:
        raise HTTPException(status_code=400, detail="Token expired! Request again.")
    
    await db["users"].update_one(
        {"reset_token": data.token},
        {"$set": {
            "password": hash_password(data.new_password),
            "reset_token": None,           
            "reset_token_expiry": None     
        }}
    )
    
    return {"message": "Password reset successful! Please login."}