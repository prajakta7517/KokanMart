import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  min: number
  max: number
  step?: number
  size?: 'sm' | 'md'
  onChange: (value: number) => void
}

export function QuantitySelector({
  value,
  min,
  max,
  step = 1,
  size = 'md',
  onChange,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - step))
  const increase = () => onChange(Math.min(max, value + step))

  const compact = size === 'sm'

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-sand bg-white ${
        compact ? 'gap-1 px-1 py-0.5' : 'gap-3 px-2 py-1'
      }`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className={`rounded-lg text-earth transition hover:bg-sand/50 disabled:opacity-40 ${
          compact ? 'p-1' : 'p-1.5'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus size={compact ? 14 : 16} />
      </button>
      <span className={`text-center font-semibold ${compact ? 'min-w-[1.5rem] text-sm' : 'min-w-[2rem]'}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className={`rounded-lg text-earth transition hover:bg-sand/50 disabled:opacity-40 ${
          compact ? 'p-1' : 'p-1.5'
        }`}
        aria-label="Increase quantity"
      >
        <Plus size={compact ? 14 : 16} />
      </button>
    </div>
  )
}
