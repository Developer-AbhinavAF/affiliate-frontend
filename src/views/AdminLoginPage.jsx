import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function AdminLoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const { push } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Admin Login</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Enter your admin username to access the operations panel.</div>

        <div className="mt-6 space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (e.g. Suryadev)"
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
              await login({ username, password })
              push('Logged in')
              nav('/admin')
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
      </div>
    </div>
  )
}
