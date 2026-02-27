import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, LayoutDashboard, ShoppingBag, User, Zap } from 'lucide-react'

import { useAuth } from '../state/auth'
import { ToastProvider, useToast } from '../components/Toaster/Toaster'

const navItems = [
  { to: '/category/electrical', label: 'Electrical' },
  { to: '/category/supplements', label: 'Gym Supplements' },
  { to: '/category/clothes_men', label: 'Men' },
  { to: '/category/clothes_women', label: 'Women' },
  { to: '/category/clothes_kids', label: 'Kids' },
]

function TopNav() {
  const { user, logout } = useAuth()
  const { push } = useToast()

  const panelLink = useMemo(() => {
    if (!user?.role) return null
    if (user.role === 'SUPER_ADMIN') return { to: '/superadmin', label: 'Panel' }
    if (user.role === 'ADMIN') return { to: '/admin', label: 'Panel' }
    if (user.role === 'SELLER') return { to: '/seller', label: 'Panel' }
    if (user.role === 'CUSTOMER') return { to: '/account', label: 'Account' }
    return null
  }, [user?.role])

  return (
    <div className="sticky top-0 z-40 px-[7px] pt-[7px] bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 px-4 py-3 text-zinc-50 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo.jpeg" alt="TrendKart" className="h-9 w-9 rounded-sm border border-zinc-300 object-cover dark:border-zinc-700" />
          <div className="leading-tight">
            <div className="text-xl font-semibold text-zinc-50">TrendKart</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-sm px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'bg-white/10 text-zinc-50'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-sm text-[hsl(var(--muted-fg))] sm:block">Hi, {user.name}</div>

              {panelLink ? (
                <Link
                  to={panelLink.to}
                  className="hidden items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 sm:inline-flex"
                >
                  {panelLink.label === 'Account' ? <User className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                  {panelLink.label}
                </Link>
              ) : null}

              <button
                onClick={() => {
                  logout()
                  push('Logged out')
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            to={user ? '/wishlist' : '/login?redirect=%2Fwishlist'}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800 hover:border-zinc-500"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </Link>
          <Link
            to={user ? '/cart' : '/login?redirect=%2Fcart'}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800 hover:border-zinc-500"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-6xl pb-3 md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 p-2 shadow-sm backdrop-blur">
          {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-sm px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="border-t border-[hsl(var(--border))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Multiverse Affiliate</div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Built for speed + smooth animations
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 transition-colors duration-300">
        {/* Force app-wide dark mode */}
        {typeof document !== 'undefined' && document.documentElement.classList.contains('dark') === false
          ? document.documentElement.classList.add('dark')
          : null}
        <TopNav />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </ToastProvider>
  )
}
