from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth


app = FastAPI(
title = "kokanmart_backend",
Description = "Backend for selling authentic Konkan products",
version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
async def home():
    return{"message":"Welcome to KokanMart"}