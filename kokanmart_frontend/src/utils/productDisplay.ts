import type { Product } from '@/types/product.types'

const CATEGORY_META: Record<string, { emoji: string; gradient: string }> = {
  Mangoes: { emoji: '🥭', gradient: 'from-amber-100 via-orange-50 to-yellow-100' },
  Cashews: { emoji: '🌰', gradient: 'from-amber-50 via-yellow-50 to-orange-100' },
  Kokum: { emoji: '🍒', gradient: 'from-purple-100 via-pink-50 to-red-50' },
  Spices: { emoji: '🌶️', gradient: 'from-red-50 via-orange-50 to-amber-50' },
  Coconut: { emoji: '🥥', gradient: 'from-stone-100 via-neutral-50 to-amber-50' },
  Honey: { emoji: '🍯', gradient: 'from-yellow-100 via-amber-50 to-orange-50' },
  Pickles: { emoji: '🫙', gradient: 'from-lime-50 via-green-50 to-emerald-50' },
  'Dry Fruits': { emoji: '🥜', gradient: 'from-amber-100 via-orange-50 to-yellow-100' },
}

const DEFAULT_META = { emoji: '🌿', gradient: 'from-green-50 via-emerald-50 to-teal-50' }

const FALLBACK_IMAGES: Record<string, string> = {
  Mangoes: 'https://images.unsplash.com/photo-1553279768-865502f9e8d1?w=500&h=500&fit=crop&auto=format',
  Cashews: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop&auto=format',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop&auto=format',
  Coconut: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop&auto=format',
  Honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop&auto=format',
}

const GENERIC_FALLBACK =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop&auto=format'

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_META
}

export function getProductImageUrl(product: Product): string | null {
  return product.image_url
}

export function getProductFallbackImage(category: string): string {
  return FALLBACK_IMAGES[category] ?? GENERIC_FALLBACK
}

export type StockLevel = 'in_stock' | 'low_stock' | 'out_of_stock'

export function getStockLevel(product: Product): StockLevel {
  if (!product.is_available || product.stock <= 0) return 'out_of_stock'
  if (product.stock <= product.min_order_qty * 2) return 'low_stock'
  return 'in_stock'
}

export function getStockLabel(product: Product): string {
  const level = getStockLevel(product)
  if (level === 'out_of_stock') return 'Sold Out'
  if (level === 'low_stock') return `Only ${product.stock} ${product.unit} left`
  return 'In Stock'
}
