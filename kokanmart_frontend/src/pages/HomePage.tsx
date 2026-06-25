import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Leaf, Truck, Shield } from 'lucide-react'
import { productsApi } from '@/api/products.api'
import type { Product } from '@/types/product.types'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

const testimonials = [
  { name: 'Priya S.', text: 'The Alphonso mangoes tasted just like my grandmother\'s village in Ratnagiri. Absolutely divine!', rating: 5 },
  { name: 'Rahul K.', text: 'Best cashews I\'ve ever had. Fresh, crunchy, and delivered within 2 days.', rating: 5 },
  { name: 'Anita M.', text: 'Kokan kokum sharbat is now a staple in our home. Authentic Konkan flavours!', rating: 5 },
]

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([productsApi.getAll(), productsApi.getCategories()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.products.filter((p) => p.is_available).slice(0, 8))
        setCategories(catRes.data.categories)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-cream to-secondary/10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              🌿 Direct from Konkan Coast
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-earth md:text-5xl lg:text-6xl">
              Taste the <span className="text-primary">Authentic</span> Konkan
            </h1>
            <p className="mt-4 max-w-lg text-lg text-earth/70">
              Farm-fresh Alphonso mangoes, premium cashews, kokum, and spices — sourced directly from coastal villages and delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg">Shop Now <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg">Explore Categories</Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="aspect-square overflow-hidden rounded-3xl bg-primary/5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1553279768-865502f9e8d1?w=600&h=600&fit=crop&auto=format"
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1605027990121-4753a3f3e8c8?w=600&h=600&fit=crop&auto=format'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Leaf, title: 'Farm Fresh', desc: 'Sourced directly from Konkan villages' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Delivered within 2-5 business days' },
            { icon: Shield, title: 'Quality Assured', desc: '100% authentic, no middlemen' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-sand/60 bg-white p-6 text-center">
              <Icon className="mx-auto text-secondary" size={32} />
              <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-earth/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Konkan Story */}
      <section className="bg-earth py-16 text-cream">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="font-display text-3xl font-bold">Our Konkan Story</h2>
          <p className="mt-4 text-cream/80 leading-relaxed">
            Nestled between the Western Ghats and the Arabian Sea, the Konkan coast has nurtured generations of farmers growing the world's finest mangoes, cashews, and spices. KokanMart bridges this rich heritage with your kitchen — ensuring every product carries the warmth and authenticity of coastal Maharashtra.
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-earth">Shop by Category</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="rounded-full border-2 border-sand bg-white px-6 py-3 font-semibold text-earth transition hover:border-primary hover:text-primary"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-earth">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <ProductGrid products={products} variant="featured" />
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-cream to-sand/30 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-earth">What Our Customers Say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-sand/60 bg-white p-6">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="mt-3 text-sm text-earth/80 italic">"{t.text}"</p>
                <p className="mt-3 text-sm font-semibold text-earth">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
