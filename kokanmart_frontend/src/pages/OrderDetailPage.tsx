import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi } from '@/api/orders.api'
import type { Order } from '@/types/order.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { OrderStatusTracker } from '@/components/order/OrderStatusTracker'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    ordersApi.getOrder(id)
      .then((res) => setOrder(res.data.order))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-8"><Skeleton className="h-64 w-full rounded-2xl" /></div>
  if (!order) return <div className="px-4 py-16 text-center text-earth/60">Order not found</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-earth/60 hover:text-primary">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-earth/60">{formatDate(order.created_at)}</p>
          </div>
          <Badge>{order.status}</Badge>
        </div>

        <div className="mt-6">
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-earth">Items</h3>
          <div className="mt-2 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.product_name} × {item.quantity} {item.unit}</span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-sand pt-4">
          <div className="flex justify-between font-bold text-primary">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        {order.status === 'pending' && (
          <Link to={`/payment/${order.id}`} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Complete Payment →
          </Link>
        )}
      </Card>
    </div>
  )
}
