import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

export function SuperAdminCommissionPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [commissionPct, setCommissionPct] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'settings'],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/settings')
      return res.data.item
    },
  })

  const save = useMutation({
    mutationFn: async () => {
      const pct = Number(commissionPct)
      const res = await api.patch('/api/superadmin/settings', { commissionPct: pct })
      return res.data.item
    },
    onSuccess: async () => {
      push('Settings saved')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'settings'] })
    },
    onError: () => push('Failed to save'),
  })

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load settings</div>

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="text-sm font-medium text-white">Commission Settings</div>
      <div className="mt-4 text-sm text-white/70">Current: {data?.commissionPct}%</div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={commissionPct}
          onChange={(e) => setCommissionPct(e.target.value)}
          placeholder="New commission %"
          className="w-56 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40"
        />
        <button
          disabled={save.isPending}
          onClick={() => save.mutate()}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
