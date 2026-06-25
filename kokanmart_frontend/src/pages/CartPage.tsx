import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

export function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={<ShoppingCart size={48} />}
          title="Your cart is empty"
          description="Browse our authentic Konkan products and add some to your cart."
          action={
            <Link to="/products">
              <Button>Shop Products</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-earth">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdate={(qty) => updateQuantity(item.productId, qty)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>
        <CartSummary totalAmount={totalAmount()} itemCount={totalItems()} />
      </div>
    </div>
  )
}
