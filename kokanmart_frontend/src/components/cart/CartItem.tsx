import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'
import { QuantitySelector } from '@/components/ui/QuantitySelector'

interface CartItemProps {
  item: CartItemType
  onUpdate: (quantity: number) => void
  onRemove: () => void
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1605027990121-4753a3f3e8c8?w=100&h=100&fit=crop'

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-sand/60 bg-white p-4">
      <img
        src={item.imageUrl || PLACEHOLDER}
        alt={item.name}
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-earth">{item.name}</h3>
            <p className="text-sm text-earth/60">
              {formatCurrency(item.pricePerUnit)} / {item.unit}
            </p>
          </div>
          <button onClick={onRemove} className="text-red-500 transition hover:text-red-700" aria-label="Remove item">
            <Trash2 size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            min={item.minOrderQty}
            max={item.stock}
            onChange={onUpdate}
          />
          <span className="font-bold text-primary">
            {formatCurrency(item.pricePerUnit * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
