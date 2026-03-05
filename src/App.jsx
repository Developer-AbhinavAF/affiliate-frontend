import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'

import { AuthProvider, useAuth } from './state/auth'
import { DashboardLayout } from './dashboard/layout/DashboardLayout'
import { AppShell } from './ui/AppShell'
import { AdminDashboard } from './dashboard/pages/AdminDashboard'
import { AdminOrdersPage } from './dashboard/pages/AdminOrdersPage'
import { AdminProductsPage } from './dashboard/pages/AdminProductsPage'
import { AdminAddProductPage } from './dashboard/pages/AdminAddProductPage'
import { AdminEditProductPage } from './dashboard/pages/AdminEditProductPage'
import { AdminManageProductsPage } from './dashboard/pages/AdminManageProductsPage'
import { ReportsPage } from './dashboard/pages/ReportsPage'
import { SuperAdminDashboard } from './dashboard/pages/SuperAdminDashboard'
import { SuperAdminAdminsPage } from './dashboard/pages/SuperAdminAdminsPage'
import { SuperAdminCommissionPage } from './dashboard/pages/SuperAdminCommissionPage'
import { SuperAdminOrdersPage } from './dashboard/pages/SuperAdminOrdersPage'
import { SuperAdminProductsPage } from './dashboard/pages/SuperAdminProductsPage'
import { SuperAdminUsersPage } from './dashboard/pages/SuperAdminUsersPage'
import { SuperAdminAdvancedAnalyticsPage } from './dashboard/pages/SuperAdminAdvancedAnalyticsPage'
import { SuperAdminManageProductsPage } from './dashboard/pages/SuperAdminManageProductsPage'
import { SuperAdminAddProductPage } from './dashboard/pages/SuperAdminAddProductPage'
import { SuperAdminEditProductPage } from './dashboard/pages/SuperAdminEditProductPage'
import { HomePage } from './views/HomePage'
import { AdminLoginPage } from './views/AdminLoginPage'
import { CategoryPage } from './views/CategoryPage'
import { CustomerAccountPage } from './views/CustomerAccountPage'
import { CustomerOrdersPage } from './views/CustomerOrdersPage'
import { CustomerWishlistPage } from './views/CustomerWishlistPage'
import { CustomerCartPage } from './views/CustomerCartPage'
import { ProductPage } from './views/ProductPage'
import { LoginPage } from './views/LoginPage'
import { ForgotPasswordPage } from './views/ForgotPasswordPage'
import { SignupPage } from './views/SignupPage'
import { NotFoundPage } from './views/NotFoundPage'
import { SuperAdminLoginPage } from './views/SuperAdminLoginPage'
import { IntroLoader } from './components/IntroLoader'
import { HelperDashboard } from './dashboard/pages/HelperDashboard'
import { HelperAddProductPage } from './dashboard/pages/HelperAddProductPage'
import { HelperManageProductsPage } from './dashboard/pages/HelperManageProductsPage'
import { HelperEditProductPage } from './dashboard/pages/HelperEditProductPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      keepPreviousData: true,
    },
  },
})

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
      {title}
    </div>
  )
}

function RequireRole({ allowedRoles, loginPath }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="text-sm text-white/70">Loading…</div>
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    const base = loginPath || '/login'
    return <Navigate to={`${base}?redirect=${redirect}`} replace />
  }
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    const byRole = {
      SUPER_ADMIN: '/superadmin',
      ADMIN: '/admin',
      HELPER: '/helper',
      CUSTOMER: '/',
    }
    return <Navigate to={byRole[user.role] || '/'} replace />
  }
  return <Outlet />
}

function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {!introDone ? <IntroLoader onComplete={() => setIntroDone(true)} /> : null}
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Protect all product views for non-logged-in users */}
              <Route element={<RequireRole loginPath="/login" />}>
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<RequireRole allowedRoles={['SUPER_ADMIN']} loginPath="/superadmin/login" />}>
                <Route element={<DashboardLayout title="Super Admin Panel" />}>
                  <Route path="/superadmin" element={<SuperAdminDashboard />} />
                  <Route path="/superadmin/users" element={<SuperAdminUsersPage />} />
                  <Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />
                  <Route path="/superadmin/products" element={<SuperAdminProductsPage />} />
                  <Route path="/superadmin/manage-products" element={<SuperAdminManageProductsPage />} />
                  <Route path="/superadmin/products/new" element={<SuperAdminAddProductPage />} />
                  <Route path="/superadmin/products/:id/edit" element={<SuperAdminEditProductPage />} />
                  <Route path="/superadmin/orders" element={<SuperAdminOrdersPage />} />
                  <Route path="/superadmin/commission" element={<SuperAdminCommissionPage />} />
                  <Route path="/superadmin/advanced-analytics" element={<SuperAdminAdvancedAnalyticsPage />} />
                  <Route path="/superadmin/reports" element={<ReportsPage />} />
                </Route>
              </Route>

              <Route element={<RequireRole allowedRoles={['ADMIN']} loginPath="/admin/login" />}>
                <Route element={<DashboardLayout title="Admin Panel" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/manage-products" element={<AdminManageProductsPage />} />
                  <Route path="/admin/products/new" element={<AdminAddProductPage />} />
                  <Route path="/admin/products/:id/edit" element={<AdminEditProductPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                </Route>
              </Route>

              <Route element={<RequireRole allowedRoles={['HELPER']} loginPath="/admin/login" />}>
                <Route element={<DashboardLayout title="Helper Panel" />}>
                  <Route path="/helper" element={<HelperDashboard />} />
                  <Route path="/helper/manage-products" element={<HelperManageProductsPage />} />
                  <Route path="/helper/products/new" element={<HelperAddProductPage />} />
                  <Route path="/helper/products/:id/edit" element={<HelperEditProductPage />} />
                </Route>
              </Route>

              {/* Seller panel removed */}

              {/* Account routes: require login (any role) */}
              <Route element={<RequireRole loginPath="/login" />}>
                <Route path="/cart" element={<CustomerCartPage />} />
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
