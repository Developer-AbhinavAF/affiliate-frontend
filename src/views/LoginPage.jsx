import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const { push } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="text-2xl font-semibold text-white">Welcome back</div>
        <div className="mt-1 text-sm text-white/70">Login to unlock personalized picks.</div>

        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
          />
        </div>

        <button
          disabled={busy}
          onClick={async () => {
            try {
              setBusy(true)
              await login(email, password)
              push('Logged in')
              nav('/')
            } catch (e) {
              push('Login failed')
            } finally {
              setBusy(false)
            }
          }}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {busy ? 'Please wait…' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-white/70">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
