import cloudinary
import os
from dotenv import load_dotenv
import cloudinary.uploader
from fastapi import UploadFile
import io

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

async def upload_image(file: UploadFile) -> str:
    # read file contents
    contents = await file.read()
    
    # upload to cloudinary
    result = cloudinary.uploader.upload(
        io.BytesIO(contents),
        folder="kokanmart/products",   
        resource_type="image"
    )
    
    
    return result["secure_url"]