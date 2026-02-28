import { useState } from 'react'
import { useToast } from '../components/Toaster/Toaster'
import { api } from '../lib/api'

export function ForgotPasswordPage() {
  const { push } = useToast()
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSendOtp() {
    try {
      setBusy(true)
      const { data } = await api.post('/api/auth/forgot-password', { identifier })
      setMaskedEmail(data?.maskedEmail || '')
      push('OTP sent')
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
        identifier,
        code: otp,
        newPassword,
      })
      push('Password reset')
      setStep(4)
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
          Enter your email or username, we&apos;ll send a 6‑digit OTP.
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-3">
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or Username"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <button
              disabled={busy || !identifier}
              onClick={handleSendOtp}
              className="w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {busy ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Email sent to {maskedEmail || 'your email'}</div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <button
              disabled={busy || !otp}
              onClick={() => setStep(3)}
              className="w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-3">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New password"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-sm border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
            <button
              disabled={busy || !otp || !newPassword || !confirmPassword}
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  push('Passwords do not match')
                  return
                }
                handleReset()
              }}
              className="w-full rounded-sm bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {busy ? 'Resetting…' : 'Reset password'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">
            Your password has been reset. You can now log in with your new password.
          </div>
        )}
      </div>
    </div>
  )
}

