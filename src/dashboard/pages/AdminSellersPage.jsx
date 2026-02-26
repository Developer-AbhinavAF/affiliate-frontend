import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']

export function AdminSellersPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [status, setStatus] = useState('PENDING')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'sellers', status],
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
      await qc.invalidateQueries({ queryKey: ['admin', 'sellers'] })
    },
    onError: () => push('Failed to update seller'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load sellers</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Filter:</div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:focus:border-zinc-700"
        >
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Seller Approvals</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
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
                <tr key={s._id || s.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.name}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.username || ''}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.email}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.sellerStatus}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'APPROVED' })}
                        className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-1.5 text-zinc-900 hover:bg-white disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        Approve
                      </button>
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'SUSPENDED' })}
                        className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-1.5 text-zinc-900 hover:bg-white disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        Suspend
                      </button>
                      <button
                        disabled={setSellerStatus.isPending}
                        onClick={() => setSellerStatus.mutate({ id: s._id || s.id, sellerStatus: 'REJECTED' })}
                        className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-1.5 text-zinc-900 hover:bg-white disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
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
