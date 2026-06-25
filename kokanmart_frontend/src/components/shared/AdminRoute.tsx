import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ProtectedRoute } from './ProtectedRoute'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  )
}
