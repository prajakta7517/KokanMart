import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '', email: user?.email || '' },
  })

  const onSubmit = async (data: { name: string; phone: string; email: string }) => {
    setLoading(true)
    try {
      await updateProfile(data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-earth">My Profile</h1>

      <Card className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-earth">{user.name}</p>
            <Badge variant={user.role === 'admin' ? 'warning' : 'default'}>{user.role}</Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" {...register('name')} />
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Phone" {...register('phone')} />
          <Button type="submit" isLoading={loading}>Save Changes</Button>
        </form>
      </Card>
    </div>
  )
}
