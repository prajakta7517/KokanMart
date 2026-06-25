import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi } from '@/api/products.api'
import type { Product } from '@/types/product.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1605027990121-4753a3f3e8c8?w=600&h=600&fit=crop'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    if (!id) return
    productsApi.getById(id)
      .then(async (res) => {
        const prod = res.data.product
        setProduct(prod)
        setQuantity(prod.min_order_qty)
        const allRes = await productsApi.getAll()
        setRelated(
          allRes.data.products
            .filter((p) => p.id !== id && p.category === prod.category)
            .slice(0, 4)
        )
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-earth/60">Product not found</p>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">← Back to Products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-earth/60 hover:text-primary">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-sand/60 bg-white">
          <img
            src={product.image_url || PLACEHOLDER}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">{product.category}</Badge>
            {product.is_seasonal && <Badge variant="warning">Seasonal</Badge>}
            {!product.is_available && <Badge variant="danger">Out of Stock</Badge>}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-earth">{product.name}</h1>
          <p className="mt-2 flex items-center gap-1 text-earth/60">
            <MapPin size={16} /> From {product.origin_village}, Konkan
          </p>

          <p className="mt-6 text-3xl font-bold text-primary">
            {formatCurrency(product.price_per_unit)}
            <span className="text-base font-normal text-earth/60"> / {product.unit}</span>
          </p>

          <p className="mt-4 text-sm text-earth/70">
            Min order: {product.min_order_qty} {product.unit} · Stock: {product.stock} {product.unit}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <QuantitySelector
              value={quantity}
              min={product.min_order_qty}
              max={product.stock}
              onChange={setQuantity}
            />
            <Button size="lg" onClick={handleAddToCart} disabled={!product.is_available || product.stock <= 0}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-earth">Related Products</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  )
}
