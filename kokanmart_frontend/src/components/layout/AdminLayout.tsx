import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive ? 'bg-primary text-white' : 'text-earth/80 hover:bg-sand/50'
  }`

export function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-24 space-y-1 rounded-2xl border border-sand/60 bg-white p-3">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            <Package size={18} /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <ShoppingBag size={18} /> Orders
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
