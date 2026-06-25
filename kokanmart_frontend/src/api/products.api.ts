import api from './axios'
import type { Product, ProductCreatePayload, ProductUpdatePayload } from '@/types/product.types'

export const productsApi = {
  getAll: () => api.get<{ products: Product[] }>('/products/get_all_products'),

  getById: (id: string) => api.get<{ product: Product }>(`/products/${id}`),

  getCategories: () => api.get<{ categories: string[] }>('/products/categories'),

  create: (data: ProductCreatePayload) =>
    api.post<{ message: string; product: Product }>('/products/create_product', data),

  update: (id: string, data: ProductUpdatePayload) =>
    api.put<{ message: string; product: Product }>(`/products/update_product/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/products/delete_product/${id}`),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post<{ message: string; image_url: string }>(
      `/products/${id}/image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },
}
