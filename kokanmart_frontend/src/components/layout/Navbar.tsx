import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Leaf, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-earth/80 hover:text-primary'}`

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.totalItems())

  return (
    <header className="sticky top-0 z-50 border-b border-sand/60 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="text-primary" size={28} />
          <span className="font-display text-2xl font-bold text-primary">KokanMart</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-xl p-2 transition hover:bg-sand/40" aria-label="Cart">
            <ShoppingCart size={22} className="text-earth" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/profile" className="rounded-xl p-2 transition hover:bg-sand/40" aria-label="Profile">
                <User size={22} className="text-earth" />
              </Link>
              <button onClick={logout} className="rounded-xl p-2 transition hover:bg-sand/40" aria-label="Logout">
                <LogOut size={20} className="text-earth/70" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button size="sm">Login</Button>
            </Link>
          )}

          <button
            className="rounded-xl p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-sand/60 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)} end>Home</NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setOpen(false)}>Products</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/orders" className={navLinkClass} onClick={() => setOpen(false)}>My Orders</NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>
                )}
                <button onClick={() => { logout(); setOpen(false) }} className="text-left text-sm text-red-600">
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
