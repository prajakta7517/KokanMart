export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  is_active: boolean
  created_at: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  phone: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  access_token: string
  token_type: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
}
