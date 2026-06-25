import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { productsApi } from '@/api/products.api'
import type { Product, ProductCreatePayload } from '@/types/product.types'
import { buildCategoryOptions, UNIT_OPTIONS } from '@/constants/productOptions'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface ProductFormProps {
  initial?: Product
  onSubmit: (data: ProductCreatePayload) => Promise<void>
  isLoading?: boolean
  imageSection?: React.ReactNode
}

export function ProductForm({ initial, onSubmit, isLoading, imageSection }: ProductFormProps) {
  const [categoryOptions, setCategoryOptions] = useState(buildCategoryOptions())

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductCreatePayload>({
    defaultValues: {
      min_order_qty: 1,
      is_seasonal: false,
      category: '',
      unit: '',
    },
  })

  const isSeasonal = watch('is_seasonal')

  useEffect(() => {
    productsApi.getCategories()
      .then((res) => setCategoryOptions(buildCategoryOptions(res.data.categories)))
      .catch(() => setCategoryOptions(buildCategoryOptions()))
  }, [])

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name,
        category: initial.category,
        origin_village: initial.origin_village,
        unit: initial.unit,
        min_order_qty: initial.min_order_qty,
        stock: initial.stock,
        price_per_unit: initial.price_per_unit,
        is_seasonal: initial.is_seasonal,
        season_start: initial.season_start,
        season_end: initial.season_end,
      })
    }
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {imageSection && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-earth">Product Image</h3>
          {imageSection}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Product Name"
          id="name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />

        <Select
          label="Category"
          id="category"
          options={categoryOptions}
          {...register('category', { required: 'Category is required' })}
          error={errors.category?.message}
        />

        <Input
          label="Origin Village"
          id="origin_village"
          {...register('origin_village', { required: 'Origin village is required' })}
          error={errors.origin_village?.message}
        />

        <Select
          label="Unit"
          id="unit"
          options={UNIT_OPTIONS}
          {...register('unit', { required: 'Unit is required' })}
          error={errors.unit?.message}
        />

        <Input
          label="Price per Unit (₹)"
          id="price_per_unit"
          type="number"
          step="0.01"
          min="0"
          {...register('price_per_unit', {
            required: 'Price is required',
            valueAsNumber: true,
            min: { value: 0.01, message: 'Price must be greater than 0' },
          })}
          error={errors.price_per_unit?.message}
        />

        <Input
          label="Stock"
          id="stock"
          type="number"
          step="0.1"
          min="0"
          {...register('stock', {
            required: 'Stock is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Stock cannot be negative' },
          })}
          error={errors.stock?.message}
        />

        <Input
          label="Min Order Qty"
          id="min_order_qty"
          type="number"
          step="0.1"
          min="0.1"
          {...register('min_order_qty', {
            valueAsNumber: true,
            min: { value: 0.1, message: 'Minimum 0.1' },
          })}
          error={errors.min_order_qty?.message}
        />

        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="is_seasonal"
            {...register('is_seasonal')}
            className="h-4 w-4 rounded border-sand text-primary focus:ring-primary"
          />
          <label htmlFor="is_seasonal" className="text-sm font-medium text-earth">
            Seasonal Product
          </label>
        </div>

        {isSeasonal && (
          <>
            <Input
              label="Season Start (month 1–12)"
              id="season_start"
              type="number"
              min="1"
              max="12"
              {...register('season_start', { valueAsNumber: true })}
              error={errors.season_start?.message}
            />
            <Input
              label="Season End (month 1–12)"
              id="season_end"
              type="number"
              min="1"
              max="12"
              {...register('season_end', { valueAsNumber: true })}
              error={errors.season_end?.message}
            />
          </>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        {initial ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  )
}
