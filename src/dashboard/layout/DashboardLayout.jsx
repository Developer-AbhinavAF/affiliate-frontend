import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Boxes, ClipboardList, FileText, Settings, Shield, ShoppingBag, Users } from 'lucide-react'

import { useAuth } from '../../state/auth'

function SidebarItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
          isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  )
}

const menuByRole = {
  SUPER_ADMIN: [
    { to: '/superadmin', icon: BarChart3, label: 'Dashboard' },
    { to: '/superadmin/admins', icon: Shield, label: 'Manage Admins' },
    { to: '/superadmin/sellers', icon: Users, label: 'Manage Sellers' },
    { to: '/superadmin/products', icon: Boxes, label: 'Manage Products' },
    { to: '/superadmin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/superadmin/commission', icon: Settings, label: 'Commission Settings' },
    { to: '/superadmin/reports', icon: FileText, label: 'Reports' },
  ],
  ADMIN: [
    { to: '/admin', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin/sellers', icon: Users, label: 'Seller Management' },
    { to: '/admin/products', icon: Boxes, label: 'Product Approval' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
  ],
  SELLER: [
    { to: '/seller', icon: BarChart3, label: 'Dashboard' },
    { to: '/seller/products', icon: Boxes, label: 'My Products' },
    { to: '/seller/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/seller/earnings', icon: BarChart3, label: 'Earnings' },
    { to: '/seller/settings', icon: Settings, label: 'Profile Settings' },
  ],
  CUSTOMER: [
    { to: '/', icon: ShoppingBag, label: 'Store' },
    { to: '/orders', icon: ClipboardList, label: 'My Orders' },
    { to: '/wishlist', icon: Boxes, label: 'Wishlist' },
    { to: '/account', icon: Users, label: 'Account' },
  ],
}

export function DashboardLayout({ title }) {
  const { user, logout } = useAuth()
  const menu = menuByRole[user?.role] || []

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <div className="flex items-center gap-2 px-2 py-2">
              <img src="/Logo.jpeg" alt="TrendKart" className="h-9 w-9 rounded-xl border border-white/10 object-cover" />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">TrendKart</div>
                <div className="text-xs text-white/60">{user?.role || ''}</div>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {menu.map((m) => (
                <SidebarItem key={m.to} to={m.to} icon={m.icon} label={m.label} />
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold text-white">{title}</div>
              <div className="text-sm text-white/60">Hi, {user?.name}</div>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
