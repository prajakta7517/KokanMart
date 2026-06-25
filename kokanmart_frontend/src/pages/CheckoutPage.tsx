import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { ordersApi } from '@/api/orders.api'
import { buildOrderPayload } from '@/utils/orderHelpers'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Address } from '@/types/order.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const { items, totalAmount } = useCartStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<Address>()

  const onSubmit = async (address: Address) => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }
    setLoading(true)
    try {
      const payload = buildOrderPayload(items, address)
      const res = await ordersApi.create(payload)
      toast.success('Order placed!')
      navigate(`/payment/${res.data.order_id}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to place order'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-earth">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Delivery Address</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 md:grid-cols-2">
            <Input label="Full Name" {...register('fullName', { required: 'Required' })} error={errors.fullName?.message} />
            <Input label="Phone" {...register('phone', { required: 'Required' })} error={errors.phone?.message} />
            <div className="md:col-span-2">
              <Input label="Street Address" {...register('street', { required: 'Required' })} error={errors.street?.message} />
            </div>
            <Input label="City" {...register('city', { required: 'Required' })} error={errors.city?.message} />
            <Input label="State" {...register('state', { required: 'Required' })} error={errors.state?.message} />
            <Input label="Pincode" {...register('pincode', { required: 'Required' })} error={errors.pincode?.message} />
            <div className="md:col-span-2">
              <Button type="submit" size="lg" isLoading={loading} className="w-full md:w-auto">
                Place Order & Pay
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-earth/70">{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.pricePerUnit * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-sand pt-2">
              <div className="flex justify-between font-bold text-primary">
                <span>Total</span>
                <span>{formatCurrency(totalAmount())}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
