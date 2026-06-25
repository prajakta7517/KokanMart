const TOKEN_KEY = 'kokanmart_token'
const USER_KEY = 'kokanmart_user'
const CART_KEY = 'kokanmart_cart'

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: <T>() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  },
  setUser: <T>(user: T) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getCart: <T>() => {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  },
  setCart: <T>(cart: T) => localStorage.setItem(CART_KEY, JSON.stringify(cart)),
  removeCart: () => localStorage.removeItem(CART_KEY),
}
