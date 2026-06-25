import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { ordersApi } from '@/api/orders.api'
import type { Order } from '@/types/order.types'
import { OrderCard } from '@/components/order/OrderCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { getErrorMessage } from '@/utils/getErrorMessage'
import toast from 'react-hot-toast'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-earth">My Orders</h1>
      <p className="mt-2 text-earth/60">Track your Konkan product deliveries</p>

      <div className="mt-8 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="No orders yet"
            description="Your order history will appear here once you make a purchase."
          />
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}
