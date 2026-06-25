import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi } from '@/api/products.api'
import type { Product } from '@/types/product.types'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    productsApi.getAll()
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await productsApi.delete(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-earth">Products</h1>
        <Link to="/admin/products/new">
          <Button><Plus size={18} /> Add Product</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-sand/60 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="border-b border-sand/40">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatCurrency(p.price_per_unit)}/{p.unit}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.is_available ? 'success' : 'danger'}>
                    {p.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-primary hover:text-primary-dark">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
