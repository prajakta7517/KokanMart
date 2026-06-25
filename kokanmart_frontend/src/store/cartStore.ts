import { create } from 'zustand'
import { storage } from '@/utils/storage'
import type { Product } from '@/types/product.types'

export interface CartItem {
  productId: string
  name: string
  pricePerUnit: number
  unit: string
  minOrderQty: number
  quantity: number
  imageUrl: string | null
  stock: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalAmount: () => number
  getItemQuantity: (productId: string) => number
}

function persist(items: CartItem[]) {
  storage.setCart(items)
}

function loadItems(): CartItem[] {
  return storage.getCart<CartItem[]>() || []
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadItems(),

  addItem: (product, quantity) => {
    const qty = quantity ?? product.min_order_qty
    const items = [...get().items]
    const existing = items.find((i) => i.productId === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock)
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        pricePerUnit: product.price_per_unit,
        unit: product.unit,
        minOrderQty: product.min_order_qty,
        quantity: Math.min(qty, product.stock),
        imageUrl: product.image_url,
        stock: product.stock,
      })
    }
    persist(items)
    set({ items })
  },

  removeItem: (productId) => {
    const items = get().items.filter((i) => i.productId !== productId)
    persist(items)
    set({ items })
  },

  updateQuantity: (productId, quantity) => {
    const items = get().items.map((i) =>
      i.productId === productId
        ? { ...i, quantity: Math.max(i.minOrderQty, Math.min(quantity, i.stock)) }
        : i
    )
    persist(items)
    set({ items })
  },

  clearCart: () => {
    storage.removeCart()
    set({ items: [] })
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0),

  getItemQuantity: (productId) => {
    const item = get().items.find((i) => i.productId === productId)
    return item?.quantity ?? 0
  },
}))
