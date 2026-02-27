import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Boxes, ClipboardList, FileText, Moon, Settings, Shield, ShoppingBag, Sun, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../state/auth'

function SidebarItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
          isActive
            ? 'bg-black/8 text-[hsl(var(--fg))] dark:bg-white/12'
            : 'text-[hsl(var(--muted-fg))] hover:bg-black/5 hover:text-[hsl(var(--fg))] dark:hover:bg-white/10'
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
    { to: '/superadmin/users', icon: Users, label: 'User Management' },
    { to: '/superadmin/admins', icon: Shield, label: 'Manage Admins' },
    { to: '/superadmin/sellers', icon: Users, label: 'Manage Sellers' },
    { to: '/superadmin/products', icon: Boxes, label: 'Manage Products' },
    { to: '/superadmin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/superadmin/commission', icon: Settings, label: 'Commission Settings' },
    { to: '/superadmin/advanced-analytics', icon: BarChart3, label: 'Advanced Analytics' },
    { to: '/superadmin/reports', icon: FileText, label: 'Reports' },
    { to: '/superadmin/platform-controls', icon: Settings, label: 'Platform Controls' },
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

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const ThemeIcon = useMemo(() => (theme === 'dark' ? Sun : Moon), [theme])

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
            <div className="flex items-center gap-2 px-2 py-2">
              <img
                src="/Logo.jpeg"
                alt="TrendKart"
                className="h-9 w-9 rounded-sm border border-zinc-200 object-cover dark:border-zinc-700"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[hsl(var(--fg))]">TrendKart</div>
                <div className="text-xs text-[hsl(var(--muted-fg))]">{user?.role || ''}</div>
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
              <div className="text-2xl font-semibold text-[hsl(var(--fg))]">{title}</div>
              <div className="text-sm text-[hsl(var(--muted-fg))]">Hi, {user?.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                className="grid h-10 w-10 place-items-center rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-zinc-700 transition hover:bg-black/5 hover:text-zinc-950 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Toggle theme"
                type="button"
              >
                <ThemeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={logout}
                className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
