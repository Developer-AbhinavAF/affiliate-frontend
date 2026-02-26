import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function SellerLoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const { push } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Seller Login</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Sign in to manage products and orders.</div>

        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
        </div>

        <button
          disabled={busy}
          onClick={async () => {
            try {
              setBusy(true)
              await login({ email, password })
              push('Logged in')
              nav('/seller')
            } catch {
              push('Login failed')
            } finally {
              setBusy(false)
            }
          }}
          className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? 'Please wait…' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Want to become a seller?{' '}
          <Link to="/signup" className="text-zinc-900 hover:underline dark:text-zinc-100">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
