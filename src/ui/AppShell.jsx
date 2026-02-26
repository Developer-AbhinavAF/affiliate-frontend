import { motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Sparkles, Zap } from 'lucide-react'

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

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Multiverse</div>
            <div className="text-xs text-white/60">Affiliate Store</div>
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
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
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
              <div className="hidden text-sm text-white/70 sm:block">Hi, {user.name}</div>
              <button
                onClick={() => {
                  logout()
                  push('Logged out')
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2 text-sm font-medium text-white shadow-[0_10px_25px_rgba(99,102,241,0.25)] transition hover:opacity-95"
              >
                Sign up
              </Link>
            </>
          )}
          <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
            <ShoppingBag className="h-4 w-4 text-white/80" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
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
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
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
