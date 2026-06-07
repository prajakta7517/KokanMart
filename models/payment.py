from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: str
    amount: float
    currency: str = "INR"

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    razorpay_order_id: str
    amount: float
    currency: str
    
    status: str
    method: Optional[str] = None
    created_at: datetime