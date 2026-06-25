import api from './axios'
import type {
  User,
  SignupPayload,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth.types'

export const authApi = {
  signup: (data: SignupPayload) =>
    api.post<{ message: string; user_id: string }>('/auth/signup', data),

  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    api.post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    api.post<{ message: string }>('/auth/reset-password', data),

  getMe: () => api.get<{ user: User }>('/auth/me'),

  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'email'>>) =>
    api.put<{ message: string; user: User }>('/auth/profile', data),
}
