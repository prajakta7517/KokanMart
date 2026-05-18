from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name:str
    category:str
    price_per_unit:float
    unit:str
    min_order_qyt:float=1.0
    stock:float
    
    
class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    origin_village: str
    price_per_unit: float
    unit: str
    stock: float
    is_available: bool