import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const statuses = ['', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DRAFT']

export function SuperAdminProductsPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [status, setStatus] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'products', status],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/products', { params: status ? { status } : {} })
      return res.data.items || []
    },
  })

  const setProductStatus = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const res = await api.patch(`/api/superadmin/products/${id}/status`, { status: nextStatus })
      return res.data
    },
    onSuccess: async () => {
      push('Product updated')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'products'] })
    },
    onError: () => push('Failed to update product'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load products</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-sm text-white/70">Filter:</div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none"
        >
          {statuses.map((s) => (
            <option key={s || 'ALL'} value={s}>
              {s || 'ALL'}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Products Moderation</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Seller</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="py-2 text-white/80">{p.title}</td>
                  <td className="py-2 text-white/70">{p.sellerId?.name || ''}</td>
                  <td className="py-2 text-white/80">₹ {Math.round(p.price).toLocaleString()}</td>
                  <td className="py-2 text-white/80">{p.stock}</td>
                  <td className="py-2 text-white/80">{p.status}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={setProductStatus.isPending}
                        onClick={() => setProductStatus.mutate({ id: p._id, nextStatus: 'APPROVED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={setProductStatus.isPending}
                        onClick={() => setProductStatus.mutate({ id: p._id, nextStatus: 'REJECTED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Reject
                      </button>
                      <button
                        disabled={setProductStatus.isPending}
                        onClick={() => setProductStatus.mutate({ id: p._id, nextStatus: 'SUSPENDED' })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-white/60">
                    No products
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
