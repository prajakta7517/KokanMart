import type { CartItem } from '@/store/cartStore'
import type { OrderCreatePayload } from '@/types/order.types'
import type { Address } from '@/types/order.types'

export function buildOrderPayload(
  items: CartItem[],
  address: Address,
  notes?: string
): OrderCreatePayload {
  return {
    address,
    items: items.map((item) => ({
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price_per_unit: item.pricePerUnit,
      subtotal: item.pricePerUnit * item.quantity,
    })),
    notes,
  }
}
