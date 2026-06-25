import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users } from 'lucide-react'
import { productsApi } from '@/api/products.api'
import { ordersApi } from '@/api/orders.api'
import { Card } from '@/components/ui/Card'

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0 })

  useEffect(() => {
    Promise.all([productsApi.getAll(), ordersApi.getAllOrders()])
      .then(([prodRes, orderRes]) => {
        const orders = orderRes.data.orders
        setStats({
          products: prodRes.data.products.length,
          orders: orders.length,
          pending: orders.filter((o) => o.status === 'pending').length,
        })
      })
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, link: '/admin/products', color: 'text-primary' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, link: '/admin/orders', color: 'text-secondary' },
    { label: 'Pending Orders', value: stats.pending, icon: Users, link: '/admin/orders', color: 'text-accent' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-earth">Admin Dashboard</h1>
      <p className="mt-2 text-earth/60">Manage your KokanMart store</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, link, color }) => (
          <Link key={label} to={link}>
            <Card hover>
              <Icon className={color} size={28} />
              <p className="mt-3 text-3xl font-bold text-earth">{value}</p>
              <p className="text-sm text-earth/60">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
