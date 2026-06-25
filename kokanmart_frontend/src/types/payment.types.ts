export interface PaymentCreateResponse {
  razorpay_order_id: string
  amount: number
  currency: string
  key_id: string
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
