import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { api } from '../../lib/api'
import { KpiCard } from '../components/KpiCard'
import { RecentOrdersTable } from '../components/RecentOrdersTable'

export function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/admin/summary')
      return res.data
    },
  })

  const ordersQuery = useQuery({
    queryKey: ['orders', 'recent', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/orders', { params: { limit: 10 } })
      return res.data.items || []
    },
  })

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load dashboard</div>

  const k = data.kpis
  const series = data.monthly || []
  const statusEntries = Object.entries(k.ordersByStatus || {})
  const statusData = statusEntries.map(([name, value]) => ({ name, value }))
  const statusColors = {
    PLACED: '#6366f1',
    CONFIRMED: '#22c55e',
    SHIPPED: '#06b6d4',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Sellers" value={k.pendingSellers} />
        <KpiCard label="Pending Products" value={k.pendingProducts} />
        <KpiCard label="Total Orders" value={k.totalOrders} />
        <KpiCard label="Shipped" value={k.ordersByStatus?.SHIPPED || 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="text-sm font-medium text-white">Orders by Status</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={110}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Orders by Month</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
              <YAxis stroke="rgba(255,255,255,0.45)" />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="orders" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
