import { useState } from 'react'
import { useToast } from '../components/Toaster/Toaster'
import { api } from '../lib/api'

export function ForgotPasswordPage() {
  const { push } = useToast()
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSendOtp() {
    try {
      setBusy(true)
      await api.post('/api/auth/forgot-password', { emailOrUsername: identifier })
      push('OTP sent if account exists')
      setStep(2)
    } catch {
      push('Failed to send OTP')
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    try {
      setBusy(true)
      await api.post('/api/auth/reset-password', {
        emailOrUsername: identifier,
        code: otp,
        newPassword,
      })
      push('Password reset')
      setStep(3)
    } catch {
      push('Failed to reset password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Forgot password</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email or username, we&apos;ll send a 6‑digit OTP.
        </div>

        {step >= 1 && (
          <div className="mt-6 space-y-3">
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or Username"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            {step === 1 && (
              <button
                disabled={busy || !identifier}
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

