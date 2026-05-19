from fastapi import FastAPI

from routes import auth


app = FastAPI(
title = "kokanmart_backend",
Description = "Backend for selling authentic Konkan products",
version="1.0.0")


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
async def home():
    return{"message":"Welcome to KokanMart"}