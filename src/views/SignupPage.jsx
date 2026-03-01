import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../state/auth'
import { useToast } from '../components/Toaster/Toaster'

export function SignupPage() {
  const nav = useNavigate()
  const { requestSignupOtp, verifySignupOtp } = useAuth()
  const { push } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Create account</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Join to save favorites and get tailored recommendations.</div>

        {step === 1 ? (
          <div className="mt-6 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password (min 8 chars)"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Email sent to {maskedEmail || email}</div>
            <input
              value={otp}
              onChange={(e) => setOtp(String(e.target.value || '').replace(/\D+/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
          </div>
        )}

        <button
          disabled={busy}
          onClick={async () => {
            try {
              setBusy(true)
              if (step === 1) {
                const data = await requestSignupOtp({ name: name.trim(), email: email.trim(), password })
                setMaskedEmail(data?.maskedEmail || '')
                setStep(2)
                push('OTP sent')
                return
              }

              await verifySignupOtp({ email: email.trim(), code: otp })
              push('Account verified')
              nav('/')
            } catch (e) {
              const msg = e?.response?.data?.message || (step === 1 ? 'Failed to send OTP' : 'Invalid OTP')
              push(msg)
            } finally {
              setBusy(false)
            }
          }}
          className="mt-5 w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? 'Please wait…' : step === 1 ? 'Send OTP' : 'Verify & create account'}
        </button>

        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-900 hover:underline dark:text-zinc-100">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
