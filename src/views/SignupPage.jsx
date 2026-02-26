import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function SignupPage() {
  const nav = useNavigate()
  const { signup } = useAuth()
  const { push } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="text-2xl font-semibold text-white">Create account</div>
        <div className="mt-1 text-sm text-white/70">Join to save favorites and get tailored recommendations.</div>

        <div className="mt-6 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
          />
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
            placeholder="Password (min 8 chars)"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
          />
        </div>

        <button
          disabled={busy}
          onClick={async () => {
            try {
              setBusy(true)
              await signup(name, email, password)
              push('Account created')
              nav('/')
            } catch {
              push('Signup failed')
            } finally {
              setBusy(false)
            }
          }}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {busy ? 'Please wait…' : 'Sign up'}
        </button>

        <div className="mt-4 text-sm text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
