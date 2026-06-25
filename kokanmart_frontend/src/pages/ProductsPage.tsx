import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, SlidersHorizontal } from 'lucide-react'
import { productsApi } from '@/api/products.api'
import type { Product } from '@/types/product.types'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { DEFAULT_CATEGORIES } from '@/constants/productOptions'

const PAGE_SIZE = 12

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState<SortOption>('name')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    Promise.all([productsApi.getAll(), productsApi.getCategories()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.products)
        const merged = [...new Set([...DEFAULT_CATEGORIES, ...catRes.data.categories])]
        setCategories(merged)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const param = searchParams.get('category') || ''
    setCategory(param)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.origin_village.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchCategory = !category || p.category === category
      return matchSearch && matchCategory && p.is_available
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price_per_unit - b.price_per_unit
        case 'price-desc':
          return b.price_per_unit - a.price_per_unit
        case 'stock':
          return b.stock - a.stock
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [products, debouncedSearch, category, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => setPage(1), [debouncedSearch, category, sort])

  const selectCategory = (cat: string) => {
    setCategory(cat)
    if (cat) {
      setSearchParams({ category: cat })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-earth">Our Products</h1>
      <p className="mt-2 text-earth/60">Authentic Konkan products, handpicked for quality</p>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectCategory('')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !category
              ? 'bg-primary text-white shadow-sm'
              : 'border border-sand bg-white text-earth/70 hover:border-primary hover:text-primary'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => selectCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === cat
                ? 'bg-primary text-white shadow-sm'
                : 'border border-sand bg-white text-earth/70 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth/40" size={20} />
          <input
            type="text"
            placeholder="Search by name, category, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-earth/40" size={18} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-full rounded-xl border border-sand bg-white py-2.5 pl-10 pr-8 outline-none focus:border-primary sm:w-48"
          >
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Most Available</option>
          </select>
        </div>
      </div>

      {!loading && (
        <p className="mt-4 text-sm text-earth/60">
          Showing <span className="font-semibold text-earth">{filtered.length}</span> product
          {filtered.length !== 1 ? 's' : ''}
          {category && (
            <> in <span className="font-semibold text-primary">{category}</span></>
          )}
        </p>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="No products found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
            <ProductGrid products={paginated} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
