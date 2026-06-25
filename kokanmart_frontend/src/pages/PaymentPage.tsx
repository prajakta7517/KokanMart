import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CreditCard } from 'lucide-react'
import { paymentsApi } from '@/api/payments.api'
import { ordersApi } from '@/api/orders.api'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { openRazorpayCheckout } from '@/utils/razorpay'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    if (!orderId) return
    ordersApi.getOrder(orderId)
      .then((res) => setAmount(res.data.order.total_amount))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false))
  }, [orderId])

  const handlePay = async () => {
    if (!orderId) return
    setPaying(true)
    try {
      const res = await paymentsApi.create(orderId)
      const { razorpay_order_id, amount, currency, key_id } = res.data

      await openRazorpayCheckout({
        key: key_id,
        amount: amount * 100,
        currency,
        order_id: razorpay_order_id,
        name: 'KokanMart',
        description: 'Konkan Products Order',
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        handler: async (response) => {
          try {
            await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            clearCart()
            toast.success('Payment successful!')
            navigate('/orders')
          } catch (err) {
            toast.error(getErrorMessage(err, 'Payment verification failed'))
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to initiate payment'))
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="text-center">
        <CreditCard className="mx-auto text-primary" size={48} />
        <h1 className="mt-4 font-display text-2xl font-bold text-earth">Complete Payment</h1>
        <p className="mt-2 text-earth/60">Order #{orderId?.slice(-8).toUpperCase()}</p>
        <p className="mt-4 text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
        <Button className="mt-8 w-full" size="lg" onClick={handlePay} isLoading={paying}>
          Pay with Razorpay
        </Button>
        <Link to="/orders" className="mt-4 inline-block text-sm text-earth/60 hover:text-primary">
          Pay later →
        </Link>
      </Card>
    </div>
  )
}
