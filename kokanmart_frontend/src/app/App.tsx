import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import toast from 'react-hot-toast'
import { router } from './router'
import { Providers } from './providers'
import { useAuthStore } from '@/store/authStore'
import { setUnauthorizedHandler } from '@/api/axios'

export function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
      toast.error('Session expired. Please login again.')
    })
    initialize()
  }, [initialize, logout])

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
