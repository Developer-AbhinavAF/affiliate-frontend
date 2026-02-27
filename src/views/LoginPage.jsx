import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Eye, EyeOff } from 'lucide-react'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function LoginPage() {
  const nav = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { push } = useToast()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Welcome back</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Login to unlock personalized picks.</div>

        <div className="mt-6 space-y-3">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or Username"
            className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-2 text-right text-xs">
          <Link to="/forgot-password" className="text-zinc-700 hover:underline dark:text-zinc-300">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={busy}
          onClick={async () => {
            try {
              setBusy(true)
              const input = identifier.trim()
              const isEmail = input.includes('@')
              const u = await login(isEmail ? { email: input, password } : { username: input, password })
              push('Logged in')

              const params = new URLSearchParams(location.search)
              const redirect = params.get('redirect')

              if (redirect) {
                nav(redirect, { replace: true })
              } else {
                const byRole = {
                  SUPER_ADMIN: '/superadmin',
                  ADMIN: '/admin',
                  CUSTOMER: '/',
                }
                nav(byRole[u?.role] || '/', { replace: true })
              }
            } catch (e) {
              push('Login failed')
            } finally {
              setBusy(false)
            }
          }}
          className="mt-5 w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? 'Please wait…' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-zinc-900 hover:underline dark:text-zinc-100">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
