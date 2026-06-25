import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface FormData {
  new_password: string
  confirm_password: string
}

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword({ token, new_password: data.new_password })
      toast.success('Password reset! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-earth/60">Invalid or missing reset token.</p>
        <Link to="/forgot-password" className="mt-4 inline-block text-primary hover:underline">Request new link</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <h1 className="text-center font-display text-2xl font-bold text-earth">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input label="New Password" type="password" {...register('new_password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.new_password?.message} />
          <Input label="Confirm Password" type="password" {...register('confirm_password', { required: 'Required', validate: (v) => v === watch('new_password') || 'Passwords do not match' })} error={errors.confirm_password?.message} />
          <Button type="submit" className="w-full" isLoading={loading}>Reset Password</Button>
        </form>
      </Card>
    </div>
  )
}
