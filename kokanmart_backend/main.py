from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.products import router as products_router
from routes.order import router as orders_router
from routes.payment import router as payment_router
from database import db
from utils.auth import hash_password
from datetime import datetime
import secrets
import string

app = FastAPI(
    title="KokanMart API",
    description="Backend for selling authentic Konkan products",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(products_router, prefix="/products", tags=["Products"])
app.include_router(orders_router, prefix="/orders", tags=["Orders"])
app.include_router(payment_router, prefix="/payments", tags=["Payments"])

def generate_password(length: int = 12) -> str:
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

@app.on_event("startup")
async def create_admin():
    existing_admin = await db["users"].find_one({"role": "admin"})
    if not existing_admin:
        password = generate_password()
        admin = {
            "name":       "KokanMart Admin",
            "email":      "prajaktathakur2001@gmail.com",
            "phone":      "9373145587",
            "password":   hash_password(password),
            "role":       "admin",
            "is_active":  True,
            "created_at": datetime.utcnow()
        }
        
        with open("admin_credentials.txt", "w") as f:
            f.write(f"Email: prajaktathakur2001@gmail.com\n")
            f.write(f"Password: {password}\n")
            
        await db["users"].insert_one(admin)
        print("===========yoooooooooooooooooooo===================")
        print("Admin created successfully!")
        print(f"Email:    prajaktathakur2001@gmail.com")
        print(f" Password: {password}")
        print("Save this password now!")
        print("===========yoooooooooooooooooooooooo===================")
    else:
        print("Admin already exists!")

@app.get("/")
def home():
    return {"message": "Welcome to KokanMart API "}