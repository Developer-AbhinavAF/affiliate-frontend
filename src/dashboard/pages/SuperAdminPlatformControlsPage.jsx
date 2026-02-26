import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

export function SuperAdminPlatformControlsPage() {
  const qc = useQueryClient()
  const { push } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'settings'],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/settings')
      return res.data.item
    },
  })

  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')

  useEffect(() => {
    if (!data) return
    setMaintenanceEnabled(Boolean(data.maintenanceEnabled))
    setMaintenanceMessage(data.maintenanceMessage || '')
  }, [data])

  const save = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/api/superadmin/settings', { maintenanceEnabled, maintenanceMessage })
      return res.data.item
    },
    onSuccess: async () => {
      push('Saved')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'settings'] })
    },
    onError: () => push('Failed to save'),
  })

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load settings</div>

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Platform Controls</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Maintenance mode blocks non-superadmin APIs with a 503 response.</div>

      <div className="mt-5 flex items-center gap-3">
        <input
          id="mm"
          type="checkbox"
          checked={maintenanceEnabled}
          onChange={(e) => setMaintenanceEnabled(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="mm" className="text-sm text-zinc-900 dark:text-zinc-100">
          Maintenance mode enabled
        </label>
      </div>

      <div className="mt-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Maintenance message</div>
        <textarea
          value={maintenanceMessage}
          onChange={(e) => setMaintenanceMessage(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:focus:border-zinc-700"
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
  )
}
