import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']

export function SuperAdminSellersPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [status, setStatus] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'sellers', status],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/sellers', { params: status ? { status } : {} })
      return res.data.items || []
    },
  })

  const setSellerStatus = useMutation({
    mutationFn: async ({ id, sellerStatus }) => {
      const res = await api.patch(`/api/superadmin/sellers/${id}/status`, { status: sellerStatus })
      return res.data
    },
    onSuccess: async () => {
      push('Seller updated')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'sellers'] })
    },
    onError: () => push('Failed to update seller'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load sellers</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-sm text-white/70">Filter:</div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none"
        >
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Sellers</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s._id || s.id} className="border-t border-white/10">
                  <td className="py-2 text-white/80">{s.name}</td>
                  <td className="py-2 text-white/80">{s.username || ''}</td>
                  <td className="py-2 text-white/80">{s.email}</td>
                  <td className="py-2 text-white/80">{s.sellerStatus}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'APPROVED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'SUSPENDED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Suspend
                      </button>
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'REJECTED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-white/60">
                    No sellers
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
