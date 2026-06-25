import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-earth/70">Page not found</p>
      <Link to="/" className="mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
