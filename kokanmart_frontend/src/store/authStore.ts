import { create } from 'zustand'
import { authApi } from '@/api/auth.api'
import { storage } from '@/utils/storage'
import type { User, LoginPayload, SignupPayload } from '@/types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginPayload) => Promise<void>
  signup: (data: SignupPayload) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'email'>>) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storage.getUser<User>(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,

  login: async (data) => {
    const res = await authApi.login(data)
    const token = res.data.access_token
    storage.setToken(token)
    set({ token, isAuthenticated: true })
    await get().fetchUser()
  },

  signup: async (data) => {
    await authApi.signup(data)
  },

  logout: () => {
    storage.removeToken()
    storage.removeUser()
    set({ user: null, token: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const res = await authApi.getMe()
      storage.setUser(res.data.user)
      set({ user: res.data.user })
    } catch {
      get().logout()
    }
  },

  updateProfile: async (data) => {
    const res = await authApi.updateProfile(data)
    storage.setUser(res.data.user)
    set({ user: res.data.user })
  },

  initialize: async () => {
    const token = storage.getToken()
    if (!token) return
    set({ isLoading: true })
    try {
      await get().fetchUser()
    } finally {
      set({ isLoading: false })
    }
  },
}))
