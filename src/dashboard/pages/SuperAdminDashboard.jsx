import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { api } from '../../lib/api'
import { KpiCard } from '../components/KpiCard'
import { RecentOrdersTable } from '../components/RecentOrdersTable'

export function SuperAdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'superadmin'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/superadmin/summary')
      return res.data
    },
  })

  const ordersQuery = useQuery({
    queryKey: ['orders', 'recent', 'superadmin'],
    queryFn: async () => {
      const res = await api.get('/api/orders', { params: { limit: 10 } })
      return res.data.items || []
    },
  })

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load dashboard</div>

  const k = data.kpis
  const series = data.monthly || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={`₹ ${Math.round(k.totalRevenue).toLocaleString()}`} />
        <KpiCard label="Platform Earnings" value={`₹ ${Math.round(k.platformEarnings).toLocaleString()}`} />
        <KpiCard label="Total Orders" value={k.totalOrders} />
        <KpiCard label="Active Sellers" value={k.activeSellers} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Recent Orders</div>
        {ordersQuery.isLoading ? (
          <div className="mt-4 text-sm text-white/70">Loading…</div>
        ) : ordersQuery.isError ? (
          <div className="mt-4 text-sm text-white/70">Failed to load orders</div>
        ) : (
          <div className="mt-4">
            <RecentOrdersTable orders={ordersQuery.data || []} />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Monthly Revenue</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
              <YAxis stroke="rgba(255,255,255,0.45)" />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
