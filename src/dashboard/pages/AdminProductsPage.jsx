import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

export function AdminProductsPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [status, setStatus] = useState('PENDING_APPROVAL')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'products', status],
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
      await qc.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
    onError: () => push('Failed to update product'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load products</div>

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
          <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Product Approval</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
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
                <tr key={p._id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.title}</td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{p.sellerId?.name || ''}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">₹ {Math.round(p.price).toLocaleString()}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.stock}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.status}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={setProductStatus.isPending}
                        onClick={() => setProductStatus.mutate({ id: p._id, nextStatus: 'APPROVED' })}
                        className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-1.5 text-zinc-900 hover:bg-white disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        Approve
                      </button>
                      <button
                        disabled={setProductStatus.isPending}
                        onClick={() => setProductStatus.mutate({ id: p._id, nextStatus: 'REJECTED' })}
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
                  <td colSpan={6} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
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
