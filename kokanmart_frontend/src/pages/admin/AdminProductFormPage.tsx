import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { productsApi } from '@/api/products.api'
import type { Product, ProductCreatePayload } from '@/types/product.types'
import { ProductForm } from '@/components/admin/ProductForm'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setPageLoading(true)
    productsApi.getById(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => {
        setNotFound(true)
        toast.error('Product not found')
      })
      .finally(() => setPageLoading(false))
  }, [id])

  const handleSubmit = async (data: ProductCreatePayload) => {
    setSubmitting(true)
    try {
      if (isEdit && id) {
        await productsApi.update(id, data)
        toast.success('Product updated!')
        navigate('/admin/products')
        return
      }

      const res = await productsApi.create(data)
      const productId = res.data.product.id

      if (pendingImage) {
        try {
          await productsApi.uploadImage(productId, pendingImage)
          toast.success('Product created with image!')
        } catch {
          toast.error('Product saved, but image upload failed. Add it from the edit page.')
          navigate(`/admin/products/${productId}/edit`)
          return
        }
      } else {
        toast.success('Product created!')
      }

      navigate('/admin/products')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!id) return
    try {
      const res = await productsApi.uploadImage(id, file)
      setProduct((p) => (p ? { ...p, image_url: res.data.image_url } : p))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(getErrorMessage(err))
      throw err
    }
  }

  if (pageLoading) {
    return (
      <div>
        <Skeleton className="mb-8 h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="py-16 text-center">
        <p className="text-earth/60">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to Products
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-earth">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>
      <p className="mt-1 text-sm text-earth/60">
        {isEdit ? 'Update product details and image' : 'Add a new Konkan product to your store'}
      </p>

      <Card className="mt-8">
        <ProductForm
          initial={product || undefined}
          onSubmit={handleSubmit}
          isLoading={submitting}
          imageSection={
            <ImageUploader
              deferUpload={!isEdit}
              onFileSelect={setPendingImage}
              onUpload={isEdit ? handleImageUpload : undefined}
              currentUrl={product?.image_url}
            />
          }
        />
      </Card>
    </div>
  )
}
