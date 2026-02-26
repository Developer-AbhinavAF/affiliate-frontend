import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Moon, ShoppingBag, Sun, Zap } from 'lucide-react'

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

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const ThemeIcon = useMemo(() => (theme === 'dark' ? Sun : Moon), [theme])

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 bg-[#f5f1e8] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Logo.jpeg"
            alt="TrendKart"
            className="h-9 w-9 rounded-sm border border-zinc-200 object-cover dark:border-zinc-800"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">TrendKart</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Multi-vendor e-commerce</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                    : 'text-zinc-700 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="grid h-9 w-9 place-items-center rounded-sm border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle dark mode"
            type="button"
          >
            <ThemeIcon className="h-4 w-4" />
          </button>
          {user ? (
            <>
              <div className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:block">Hi, {user.name}</div>
              <button
                onClick={() => {
                  logout()
                  push('Logged out')
                }}
                className="rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-sm bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
          <div className="grid h-9 w-9 place-items-center rounded-sm border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <ShoppingBag className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto rounded-sm border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                    : 'text-zinc-700 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-50'
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
    <div className="border-t border-zinc-200/70 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
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
      <div className="min-h-screen">
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
