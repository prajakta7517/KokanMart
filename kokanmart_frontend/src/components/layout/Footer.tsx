import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sand/60 bg-earth text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="text-accent" size={24} />
            <span className="font-display text-xl font-bold">KokanMart</span>
          </div>
          <p className="text-sm text-cream/80">
            Bringing the authentic taste of Konkan — Alphonso mangoes, cashews, kokum, and spices — straight from coastal villages to your doorstep.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <Link to="/products" className="hover:text-accent transition">Shop Products</Link>
            <Link to="/orders" className="hover:text-accent transition">My Orders</Link>
            <Link to="/profile" className="hover:text-accent transition">My Profile</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <span className="flex items-center gap-2"><Mail size={16} /> support@kokanmart.com</span>
            <span className="flex items-center gap-2"><Phone size={16} /> +91 93731 45587</span>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} KokanMart. All rights reserved.
      </div>
    </footer>
  )
}
