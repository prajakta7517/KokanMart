import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/api.types'

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<ApiError>
  const detail = axiosError.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length > 0) return detail[0].msg
  return fallback
}
