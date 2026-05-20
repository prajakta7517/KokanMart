from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- created when order is placed ---
class PaymentCreate(BaseModel):
    order_id: str
    amount: float
    currency: str = "INR"

# --- what app sends back ---
class PaymentResponse(BaseModel):
    id: str
    order_id: str
    razorpay_order_id: str
    amount: float
    currency: str
    
    status: str
    method: Optional[str] = None
    created_at: datetime