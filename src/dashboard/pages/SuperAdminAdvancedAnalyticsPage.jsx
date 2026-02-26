import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { api } from '../../lib/api'

export function SuperAdminAdvancedAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'superadmin', 'advanced'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/superadmin/advanced', { params: { limit: 8 } })
      return res.data
    },
  })

  const categories = useMemo(() => data?.categories || [], [data])
  const topSellers = useMemo(() => data?.topSellers || [], [data])
  const topProducts = useMemo(() => data?.topProducts || [], [data])

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load analytics</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Category Revenue</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" stroke="rgba(113,113,122,0.9)" />
                <YAxis stroke="rgba(113,113,122,0.9)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="#18181b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Top Products (by Revenue)</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="py-2">Title</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.productId} className="border-t border-zinc-200/70 dark:border-zinc-800">
                    <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.title}</td>
                    <td className="py-2 text-zinc-600 dark:text-zinc-400">{p.category}</td>
                    <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.qty}</td>
                    <td className="py-2 text-zinc-900 dark:text-zinc-100">₹ {Math.round(p.revenue).toLocaleString()}</td>
                  </tr>
                ))}
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                      No data
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Top Sellers (by Revenue)</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="py-2">Seller</th>
                <th className="py-2">Email</th>
                <th className="py-2">Items Sold</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSellers.map((s) => (
                <tr key={s.sellerId} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.name}</td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{s.email}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{s.items}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">₹ {Math.round(s.revenue).toLocaleString()}</td>
                </tr>
              ))}
              {topSellers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                    No data
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
