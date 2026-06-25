import api from './axios'
import type { PaymentCreateResponse } from '@/types/payment.types'

export const paymentsApi = {
  create: (orderId: string) =>
    api.post<PaymentCreateResponse>('/payments/create', null, {
      params: { order_id: orderId },
    }),

  verify: (params: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) =>
    api.post<{ message: string }>('/payments/verify', null, { params }),
}
