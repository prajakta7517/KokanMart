import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { LoginPayload } from '@/types/auth.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>()

  const onSubmit = async (data: LoginPayload) => {
    setLoading(true)
    try {
      await login(data)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <h1 className="text-center font-display text-2xl font-bold text-earth">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-earth/60">Login to your KokanMart account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>Login</Button>
        </form>

        <p className="mt-6 text-center text-sm text-earth/60">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  )
}
