import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1B3A24',
            color: '#F1F8F4',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#F1F8F4' } },
          error: { iconTheme: { primary: '#C62828', secondary: '#F1F8F4' } },
        }}
      />
    </ErrorBoundary>
  )
}
