interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-primary opacity-60">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-earth">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-earth/70">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
