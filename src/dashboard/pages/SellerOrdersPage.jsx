import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../lib/api'

export function SellerOrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['seller', 'orders'],
    queryFn: async () => {
      const res = await api.get('/api/orders', { params: { limit: 100 } })
      return res.data.items || []
    },
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load orders</div>

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Orders</div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="py-2">Order ID</th>
              <th className="py-2">Status</th>
              <th className="py-2">Total</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o._id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                <td className="py-2 text-zinc-900 dark:text-zinc-100">{String(o._id).slice(-8)}</td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">{o.status}</td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">₹ {Math.round(o.grandTotal).toLocaleString()}</td>
                <td className="py-2 text-zinc-600 dark:text-zinc-400">{o.paymentMethod}</td>
                <td className="py-2 text-zinc-600 dark:text-zinc-400">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                  No orders
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
