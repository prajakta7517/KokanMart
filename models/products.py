from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: str                    
    origin_village: str             
    unit: str                        
    min_order_qty: float = 1.0       
    stock: float 
    price_per_unit: float
    is_seasonal: bool = False
    season_start: Optional[int] = None   
    season_end: Optional[int] = None     

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    origin_village: str
    price_per_unit: float
    unit: str
    stock: float
    is_available: bool
    is_seasonal: bool
    season_start: Optional[int] = None
    season_end: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price_per_unit: Optional[float] = None
    stock: Optional[float] = None
    is_available: Optional[bool] = None
    season_start: Optional[int] = None
    season_end: Optional[int] = None