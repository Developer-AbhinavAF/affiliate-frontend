import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, LayoutDashboard, ShoppingBag, User, Zap, Menu, X } from 'lucide-react'

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <div className="hidden leading-tight sm:block">
            <div className="leading-tight">
              <div className="text-xl font-semibold text-zinc-50">TrendKart</div>
            </div>
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
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.span
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0, scale: mobileMenuOpen ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </motion.span>
          </button>

          {user ? (
            <>
              <div className="hidden text-sm text-[hsl(var(--muted-fg))] sm:block">Hi, {user.name}</div>

              {/* Panel/Account button is desktop-only (excluded from hamburger) */}
              {panelLink ? (
                <Link
                  to={panelLink.to}
                  className="hidden items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 md:inline-flex"
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
                className="hidden rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 md:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 md:inline-flex"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500 md:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Wishlist/Cart desktop-only; on phones they live in hamburger menu */}
          <Link
            to={user ? '/wishlist' : '/login?redirect=%2Fwishlist'}
            className="hidden h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800 hover:border-zinc-500 md:grid"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </Link>
          <Link
            to={user ? '/cart' : '/login?redirect=%2Fcart'}
            className="hidden h-9 w-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800 hover:border-zinc-500 md:grid"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Animated hamburger menu (phones) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 pb-3 shadow-lg backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-1 px-3 pt-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm transition ${
                      isActive ? 'bg-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-2 border-t border-white/10 px-3 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={user ? '/wishlist' : '/login?redirect=%2Fwishlist'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  to={user ? '/cart' : '/login?redirect=%2Fcart'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Cart
                </Link>
              </div>
            </div>

            <div className="mt-3 border-t border-white/10 px-3 pt-3">
              {user ? (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="text-[hsl(var(--muted-fg))]">Hi, {user.name}</div>
                  <button
                    onClick={() => {
                      logout()
                      push('Logged out')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 hover:border-zinc-500"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
