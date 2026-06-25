interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-lg bg-sand/60 ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-sand/60 bg-white p-4">
      <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  )
}
