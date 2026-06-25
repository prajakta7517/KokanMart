import { Link } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CartSummaryProps {
  totalAmount: number
  itemCount: number
}

export function CartSummary({ totalAmount, itemCount }: CartSummaryProps) {
  return (
    <Card className="sticky top-24">
      <h3 className="font-display text-lg font-semibold text-earth">Order Summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-earth/70">
          <span>Items ({itemCount})</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-earth/70">
          <span>Delivery</span>
          <span className="text-secondary">Free</span>
        </div>
        <div className="border-t border-sand pt-2">
          <div className="flex justify-between text-lg font-bold text-earth">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
      <Link to="/checkout" className="mt-6 block">
        <Button className="w-full" size="lg">Proceed to Checkout</Button>
      </Link>
    </Card>
  )
}
