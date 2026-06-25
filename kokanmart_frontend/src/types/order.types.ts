export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit: string
  price_per_unit: number
  subtotal: number
}

export interface Address {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
}

export interface OrderCreatePayload {
  address: Address
  items: OrderItem[]
  notes?: string
}

export interface Order {
  id: string
  user_id: string
  address: Address
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  notes?: string | null
  created_at: string
  updated_at?: string
}
