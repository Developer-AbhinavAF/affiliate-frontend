import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../lib/api'

export function CustomerOrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', 'orders'],
    queryFn: async () => {
      const res = await api.get('/api/customer/orders')
      return res.data.items || []
    },
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load orders</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-lg font-semibold text-white">My Orders</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Order ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Total</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o._id} className="border-t border-white/10">
                  <td className="py-2 text-white/80">{String(o._id).slice(-8)}</td>
                  <td className="py-2 text-white/80">{o.status}</td>
                  <td className="py-2 text-white/80">₹ {Math.round(o.grandTotal).toLocaleString()}</td>
                  <td className="py-2 text-white/70">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-white/60">
                    No orders
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
