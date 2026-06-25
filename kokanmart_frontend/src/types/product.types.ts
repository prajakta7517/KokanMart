export interface Product {
  id: string
  name: string
  category: string
  origin_village: string
  unit: string
  min_order_qty: number
  stock: number
  price_per_unit: number
  is_seasonal: boolean
  season_start: number | null
  season_end: number | null
  image_url: string | null
  is_available: boolean
  created_at?: string
}

export interface ProductCreatePayload {
  name: string
  category: string
  origin_village: string
  unit: string
  min_order_qty?: number
  stock: number
  price_per_unit: number
  is_seasonal?: boolean
  season_start?: number | null
  season_end?: number | null
}

export interface ProductUpdatePayload {
  name?: string
  price_per_unit?: number
  stock?: number
  is_available?: boolean
  season_start?: number | null
  season_end?: number | null
  image_url?: string | null
}
