from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: float
    unit: str
    price_per_unit: float
    subtotal: float

class OrderCreate(BaseModel):
    address: dict
    items: List[OrderItem]
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: str
    address: dict
    items: List[OrderItem]
    total_amount: float
    status: str
    notes: Optional[str] = None
    created_at: datetime