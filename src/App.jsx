import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { AuthProvider, useAuth } from './state/auth'
import { DashboardLayout } from './dashboard/layout/DashboardLayout'
import { AppShell } from './ui/AppShell'
import { AdminDashboard } from './dashboard/pages/AdminDashboard'
import { AdminOrdersPage } from './dashboard/pages/AdminOrdersPage'
import { AdminProductsPage } from './dashboard/pages/AdminProductsPage'
import { AdminSellersPage } from './dashboard/pages/AdminSellersPage'
import { ReportsPage } from './dashboard/pages/ReportsPage'
import { SellerDashboard } from './dashboard/pages/SellerDashboard'
import { SellerOrdersPage } from './dashboard/pages/SellerOrdersPage'
import { SellerProductsPage } from './dashboard/pages/SellerProductsPage'
import { SuperAdminDashboard } from './dashboard/pages/SuperAdminDashboard'
import { SuperAdminAdminsPage } from './dashboard/pages/SuperAdminAdminsPage'
import { SuperAdminCommissionPage } from './dashboard/pages/SuperAdminCommissionPage'
import { SuperAdminOrdersPage } from './dashboard/pages/SuperAdminOrdersPage'
import { SuperAdminProductsPage } from './dashboard/pages/SuperAdminProductsPage'
import { SuperAdminSellersPage } from './dashboard/pages/SuperAdminSellersPage'
import { HomePage } from './views/HomePage'
import { AdminLoginPage } from './views/AdminLoginPage'
import { CategoryPage } from './views/CategoryPage'
import { CustomerAccountPage } from './views/CustomerAccountPage'
import { CustomerOrdersPage } from './views/CustomerOrdersPage'
import { CustomerWishlistPage } from './views/CustomerWishlistPage'
import { ProductPage } from './views/ProductPage'
import { LoginPage } from './views/LoginPage'
import { SellerLoginPage } from './views/SellerLoginPage'
import { SignupPage } from './views/SignupPage'
import { NotFoundPage } from './views/NotFoundPage'
import { SuperAdminLoginPage } from './views/SuperAdminLoginPage'

const queryClient = new QueryClient()

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
      {title}
    </div>
  )
}

function RequireRole({ allowedRoles, loginPath }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-sm text-white/70">Loading…</div>
  if (!user) return <Navigate to={loginPath || '/login'} replace />
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    const byRole = {
      SUPER_ADMIN: '/superadmin',
      ADMIN: '/admin',
      SELLER: '/seller',
      CUSTOMER: '/',
    }
    return <Navigate to={byRole[user.role] || '/'} replace />
  }
  return <Outlet />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/seller/login" element={<SellerLoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<RequireRole allowedRoles={['SUPER_ADMIN']} loginPath="/superadmin/login" />}>
                <Route element={<DashboardLayout title="Super Admin Panel" />}>
                  <Route path="/superadmin" element={<SuperAdminDashboard />} />
                  <Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />
                  <Route path="/superadmin/sellers" element={<SuperAdminSellersPage />} />
                  <Route path="/superadmin/products" element={<SuperAdminProductsPage />} />
                  <Route path="/superadmin/orders" element={<SuperAdminOrdersPage />} />
                  <Route path="/superadmin/commission" element={<SuperAdminCommissionPage />} />
                  <Route path="/superadmin/reports" element={<ReportsPage />} />
                </Route>
              </Route>

              <Route element={<RequireRole allowedRoles={['ADMIN']} loginPath="/admin/login" />}>
                <Route element={<DashboardLayout title="Admin Panel" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/sellers" element={<AdminSellersPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                </Route>
              </Route>

              <Route element={<RequireRole allowedRoles={['SELLER']} loginPath="/seller/login" />}>
                <Route element={<DashboardLayout title="Seller Panel" />}>
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/seller/products" element={<SellerProductsPage />} />
                  <Route path="/seller/orders" element={<SellerOrdersPage />} />
                  <Route path="/seller/earnings" element={<PlaceholderPage title="Earnings (coming soon)" />} />
                  <Route path="/seller/settings" element={<PlaceholderPage title="Profile Settings (coming soon)" />} />
                </Route>
              </Route>

              <Route element={<RequireRole allowedRoles={['CUSTOMER']} loginPath="/login" />}>
                <Route path="/orders" element={<CustomerOrdersPage />} />
                <Route path="/wishlist" element={<CustomerWishlistPage />} />
                <Route path="/account" element={<CustomerAccountPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
