import { useState } from 'react'
import { useToast } from '../components/Toaster/Toaster'
import { api } from '../lib/api'

export function ForgotPasswordPage() {
  const { push } = useToast()
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSendOtp() {
    try {
      setBusy(true)
      await api.post('/api/auth/forgot-password', { username, email })
      push('If the account exists, an OTP has been sent')
      setStep(2)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send OTP'
      push(msg)
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    try {
      setBusy(true)
      await api.post('/api/auth/reset-password', {
        username,
        email,
        code: otp,
        newPassword,
      })
      push('Password reset')
      setStep(3)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reset password'
      push(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Forgot password</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your username and email, we&apos;ll send a 6‑digit OTP.
        </div>

        {step >= 1 && (
          <div className="mt-6 space-y-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            {step === 1 && (
              <button
                disabled={busy || !username || !email}
                onClick={handleSendOtp}
                className="w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {busy ? 'Sending…' : 'Send OTP'}
              </button>
            )}
          </div>
        )}

        {step >= 2 && (
          <div className="mt-6 space-y-3">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New password"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            {step === 2 && (
              <button
                disabled={busy || !otp || !newPassword}
                onClick={handleReset}
                className="w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {busy ? 'Resetting…' : 'Reset password'}
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">
            Your password has been reset. You can now log in with your new password.
          </div>
        )}
      </div>
    </div>
  )
}

