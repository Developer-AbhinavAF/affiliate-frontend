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

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-zinc-600 dark:text-zinc-400">Failed to load account</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Account</div>
        <div className="mt-4 grid gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
        </div>
        <button
          disabled={save.isPending}
          onClick={() => save.mutate()}
          className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
