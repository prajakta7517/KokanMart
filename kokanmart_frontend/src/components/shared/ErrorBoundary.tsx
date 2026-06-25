import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-earth">Something went wrong</h2>
          <p className="text-earth/70">Please refresh the page or try again later.</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      )
    }
    return this.props.children
  }
}
