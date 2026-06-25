import { Link } from 'react-router-dom'
import type { Order } from '@/types/order.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { OrderStatusTracker } from './OrderStatusTracker'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  packed: 'info',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'danger',
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card hover>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-earth/60">{formatDate(order.created_at)}</p>
          <h3 className="font-display text-lg font-semibold text-earth">
            Order #{order.id.slice(-8).toUpperCase()}
          </h3>
        </div>
        <Badge variant={statusVariant[order.status] || 'default'}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="mt-4">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sand/60 pt-4">
        <div>
          <p className="text-sm text-earth/60">{order.items.length} item(s)</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(order.total_amount)}</p>
        </div>
        <Link
          to={`/orders/${order.id}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View Details →
        </Link>
      </div>
    </Card>
  )
}
