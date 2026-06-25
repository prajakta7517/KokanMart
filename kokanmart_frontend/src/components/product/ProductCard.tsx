import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ShoppingCart, Eye, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product.types'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  getCategoryMeta,
  getProductFallbackImage,
  getStockLevel,
  getStockLabel,
} from '@/utils/productDisplay'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'featured'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const cartQty = useCartStore((s) => s.getItemQuantity(product.id))
  const [quantity, setQuantity] = useState(product.min_order_qty)
  const [imgSrc, setImgSrc] = useState(
    product.image_url || getProductFallbackImage(product.category)
  )

  const meta = getCategoryMeta(product.category)
  const stockLevel = getStockLevel(product)
  const outOfStock = stockLevel === 'out_of_stock'
  const isFeatured = variant === 'featured'

  const handleAdd = () => {
    if (outOfStock) {
      toast.error('Product is out of stock')
      return
    }
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-sand/60 bg-white shadow-sm transition hover:shadow-lg ${
        isFeatured ? 'ring-1 ring-primary/10' : ''
      }`}
    >
      {/* Image area */}
      <Link to={`/products/${product.id}`} className="group relative block">
        <div className={`relative overflow-hidden bg-sand/20 ${isFeatured ? 'aspect-[4/3]' : 'aspect-square'}`}>
          {product.image_url ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgSrc(getProductFallbackImage(product.category))}
            />
          ) : (
            <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${meta.gradient}`}>
              <span className="text-5xl drop-shadow-sm">{meta.emoji}</span>
              <span className="mt-2 text-xs font-medium text-earth/50">{product.category}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-earth/0 transition group-hover:bg-earth/40">
            <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-earth opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
              <Eye size={16} /> View Details
            </span>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isFeatured && <Badge variant="success">Featured</Badge>}
            {product.is_seasonal && <Badge variant="warning">Seasonal</Badge>}
          </div>

          <div className="absolute right-3 top-3">
            <Badge
              variant={
                stockLevel === 'out_of_stock' ? 'danger' : stockLevel === 'low_stock' ? 'warning' : 'success'
              }
            >
              {getStockLabel(product)}
            </Badge>
          </div>

          {cartQty > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow">
              <Check size={12} /> {cartQty} in cart
            </div>
          )}
        </div>
      </Link>

      {/* Info + actions */}
      <div className={`flex flex-1 flex-col ${isFeatured ? 'p-5' : 'p-4'}`}>
        <Link to={`/products/${product.id}`} className="group/title block">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{product.category}</p>
          <h3
            className={`mt-0.5 font-display font-semibold text-earth line-clamp-1 group-hover/title:text-primary ${
              isFeatured ? 'text-xl' : 'text-lg'
            }`}
          >
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-earth/60">
          <MapPin size={12} className="shrink-0" />
          <span className="line-clamp-1">{product.origin_village}, Konkan</span>
        </p>

        {isFeatured && (
          <p className="mt-2 text-sm text-earth/70">
            Min order {product.min_order_qty} {product.unit}
            {!outOfStock && ` · ${product.stock} ${product.unit} available`}
          </p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className={`font-bold text-primary ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
                {formatCurrency(product.price_per_unit)}
              </span>
              <span className="text-xs text-earth/60"> / {product.unit}</span>
              {!isFeatured && (
                <p className="mt-0.5 text-[11px] text-earth/50">
                  Min {product.min_order_qty} {product.unit}
                </p>
              )}
            </div>
          </div>

          <div className={`mt-3 flex items-center gap-2 ${isFeatured ? 'flex-col sm:flex-row' : ''}`}>
            {!outOfStock && (
              <QuantitySelector
                value={quantity}
                min={product.min_order_qty}
                max={product.stock}
                size="sm"
                onChange={setQuantity}
              />
            )}
            <Button
              size="sm"
              className={isFeatured ? 'w-full sm:flex-1' : 'flex-1'}
              onClick={handleAdd}
              disabled={outOfStock}
            >
              <ShoppingCart size={16} />
              {outOfStock ? 'Sold Out' : cartQty > 0 ? 'Add More' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
