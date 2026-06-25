import api from './axios'
import type { Order, OrderCreatePayload, OrderStatus } from '@/types/order.types'

export const ordersApi = {
  create: (data: OrderCreatePayload) =>
    api.post<{ message: string; order_id: string; total_amount: number }>(
      '/orders/create',
      data
    ),

  getMyOrders: () => api.get<{ orders: Order[] }>('/orders/my_orders'),

  getOrder: (id: string) => api.get<{ order: Order }>(`/orders/get_order/${id}`),

  getAllOrders: () => api.get<{ orders: Order[] }>('/orders/all_orders'),

  updateStatus: (id: string, status: OrderStatus) =>
    api.put<{ message: string }>(`/orders/update_status/${id}`, null, {
      params: { status },
    }),
}
