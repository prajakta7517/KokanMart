import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AdminRoute } from '@/components/shared/AdminRoute'
import { GuestRoute } from '@/components/shared/GuestRoute'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'payment/:orderId', element: <ProtectedRoute><PaymentPage /></ProtectedRoute> },
      { path: 'orders', element: <ProtectedRoute><OrdersPage /></ProtectedRoute> },
      { path: 'orders/:id', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'login', element: <GuestRoute><LoginPage /></GuestRoute> },
      { path: 'signup', element: <GuestRoute><SignupPage /></GuestRoute> },
      { path: 'forgot-password', element: <GuestRoute><ForgotPasswordPage /></GuestRoute> },
      { path: 'reset-password', element: <GuestRoute><ResetPasswordPage /></GuestRoute> },
      {
        path: 'admin',
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductFormPage /> },
          { path: 'products/:id/edit', element: <AdminProductFormPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
