import { useQuery } from '@tanstack/react-query'

import { api } from '../../lib/api'

export function HelperDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['helper', 'products', 'mine', 'summary'],
    queryFn: async () => {
      const res = await api.get('/api/products/manage/mine', { params: { page: 1, limit: 1 } })
      return res.data
    },
  })

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load dashboard</div>

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-medium text-[hsl(var(--fg))]">Helper Dashboard</div>
      <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Your product submissions are reviewed by Admin/Super Admin.</div>
      <div className="mt-4 text-sm text-[hsl(var(--muted-fg))]">Total submitted: {data?.total ?? 0}</div>
    </div>
  )
}
