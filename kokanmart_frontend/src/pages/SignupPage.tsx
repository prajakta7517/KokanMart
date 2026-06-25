import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { SignupPayload } from '@/types/auth.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function SignupPage() {
  const [loading, setLoading] = useState(false)
  const signup = useAuthStore((s) => s.signup)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<SignupPayload>()

  const onSubmit = async (data: SignupPayload) => {
    setLoading(true)
    try {
      await signup(data)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Signup failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <h1 className="text-center font-display text-2xl font-bold text-earth">Create Account</h1>
        <p className="mt-2 text-center text-sm text-earth/60">Join KokanMart for authentic Konkan products</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input label="Full Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Input label="Phone" {...register('phone', { required: 'Phone is required' })} error={errors.phone?.message} />
          <Input label="Password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message} />
          <Button type="submit" className="w-full" isLoading={loading}>Sign Up</Button>
        </form>

        <p className="mt-6 text-center text-sm text-earth/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  )
}
