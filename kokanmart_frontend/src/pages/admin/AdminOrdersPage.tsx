import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ordersApi } from '@/api/orders.api'
import type { Order, OrderStatus } from '@/types/order.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { getErrorMessage } from '@/utils/getErrorMessage'

const statuses: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    ordersApi.getAllOrders()
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status as OrderStatus)
      toast.success('Status updated!')
      fetchOrders()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-earth">Orders</h1>
      <p className="mt-2 text-earth/60">Manage and update order statuses</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-sand/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Order ID</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="border-b border-sand/40">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(-8)}</td>
                <td className="px-4 py-3">{formatDate(o.created_at)}</td>
                <td className="px-4 py-3">{o.items.length}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(o.total_amount)}</td>
                <td className="px-4 py-3"><Badge>{o.status}</Badge></td>
                <td className="px-4 py-3">
                  <Select
                    options={statuses.map((s) => ({ value: s, label: s }))}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="!py-1.5 text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
