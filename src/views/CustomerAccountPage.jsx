import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../lib/api'
import { useToast } from '../components/Toaster/Toaster'

export function CustomerAccountPage() {
  const qc = useQueryClient()
  const { push } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', 'account'],
    queryFn: async () => {
      const res = await api.get('/api/customer/account')
      return res.data.user
    },
  })

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!data) return
    setName(data.name || '')
    setPhone(data.phone || '')
  }, [data])

  const save = useMutation({
    mutationFn: async () => {
      await api.patch('/api/customer/account', { name, phone })
    },
    onSuccess: async () => {
      push('Saved')
      await qc.invalidateQueries({ queryKey: ['customer', 'account'] })
    },
    onError: () => push('Failed to save'),
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-white/70">Loading…</div>
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-white/70">Failed to load account</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-lg font-semibold text-white">Account</div>
        <div className="mt-4 grid gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
        </div>
        <button
          disabled={save.isPending}
          onClick={() => save.mutate()}
          className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
