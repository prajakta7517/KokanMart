import type { Product } from '@/types/product.types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  variant?: 'default' | 'featured'
}

export function ProductGrid({ products, variant = 'default' }: ProductGridProps) {
  const isFeatured = variant === 'featured'

  return (
    <div
      className={
        isFeatured
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  )
}
