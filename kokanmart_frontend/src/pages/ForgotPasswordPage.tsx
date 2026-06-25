import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { ForgotPasswordPayload } from '@/types/auth.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordPayload>()

  const onSubmit = async (data: ForgotPasswordPayload) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(data)
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <h1 className="text-center font-display text-2xl font-bold text-earth">Forgot Password</h1>
        <p className="mt-2 text-center text-sm text-earth/60">
          {sent ? 'Check your email for the reset link.' : 'Enter your email to receive a reset link'}
        </p>

        {!sent && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Button type="submit" className="w-full" isLoading={loading}>Send Reset Link</Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">← Back to Login</Link>
        </p>
      </Card>
    </div>
  )
}
