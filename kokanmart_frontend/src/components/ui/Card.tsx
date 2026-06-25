interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-sand/60 bg-white p-5 shadow-sm ${hover ? 'transition hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
