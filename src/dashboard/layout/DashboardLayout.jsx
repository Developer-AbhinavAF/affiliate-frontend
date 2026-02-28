import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Boxes, ClipboardList, FileText, Menu, Settings, Shield, ShoppingBag, Users, X } from 'lucide-react'
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
    { to: '/superadmin/products', icon: Boxes, label: 'Manage Products' },
    { to: '/superadmin/products/new', icon: Boxes, label: 'Add New Product' },
    { to: '/superadmin/manage-products', icon: Boxes, label: 'All Products' },
    { to: '/superadmin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/superadmin/commission', icon: Settings, label: 'Commission Settings' },
    { to: '/superadmin/advanced-analytics', icon: BarChart3, label: 'Advanced Analytics' },
    { to: '/superadmin/reports', icon: FileText, label: 'Reports' },
  ],
  ADMIN: [
    { to: '/admin', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin/products/new', icon: Boxes, label: 'Add New Product' },
    { to: '/admin/manage-products', icon: Boxes, label: 'Manage Products' },
    { to: '/admin/products', icon: Boxes, label: 'Product Approval' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const headerMeta = useMemo(() => {
    return { role: user?.role || '', name: user?.name || '' }
  }, [user?.name, user?.role])

  useEffect(() => {
    setDrawerOpen(false)
  }, [user?.role])

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <div className="sticky top-20 z-40 rounded-3xl border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--fg))] md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="text-lg font-semibold text-[hsl(var(--fg))]">{title}</div>
              <div className="text-xs text-[hsl(var(--muted-fg))]">Hi, {headerMeta.name}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close sidebar"
          />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-xs overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/Logo.jpeg"
                  alt="TrendKart"
                  className="h-9 w-9 rounded-sm border border-zinc-200 object-cover dark:border-zinc-700"
                />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[hsl(var(--fg))]">TrendKart</div>
                  <div className="text-xs text-[hsl(var(--muted-fg))]">{headerMeta.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-[hsl(var(--fg))]" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {menu.map((m) => (
                <div key={m.to} onClick={() => setDrawerOpen(false)}>
                  <SidebarItem to={m.to} icon={m.icon} label={m.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
            <div className="flex items-center gap-2 px-2 py-2">
              <img
                src="/Logo.jpeg"
                alt="TrendKart"
                className="h-9 w-9 rounded-sm border border-zinc-200 object-cover dark:border-zinc-700"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[hsl(var(--fg))]">TrendKart</div>
                <div className="text-xs text-[hsl(var(--muted-fg))]">{headerMeta.role}</div>
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}
