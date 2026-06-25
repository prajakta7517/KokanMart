import type { OrderStatus } from '@/types/order.types'
import { Check } from 'lucide-react'

const steps: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered']

const labels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

interface OrderStatusTrackerProps {
  status: OrderStatus
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === 'cancelled') {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
        Order Cancelled
      </div>
    )
  }

  const currentIndex = steps.indexOf(status)
  const progressPercent = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0

  return (
    <div className="relative px-1 py-1">
      {/* Track line — contained within this component */}
      <div className="absolute left-6 right-6 top-4 h-0.5 bg-sand" aria-hidden="true" />
      <div
        className="absolute left-6 top-4 h-0.5 bg-secondary transition-all duration-300"
        style={{ width: `calc((100% - 3rem) * ${progressPercent / 100})` }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        {steps.map((step, i) => {
          const done = i <= currentIndex
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-secondary text-white' : 'bg-sand text-earth/50'
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`mt-1 hidden text-center text-[10px] sm:block ${
                  done ? 'font-medium text-secondary' : 'text-earth/50'
                }`}
              >
                {labels[step]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
