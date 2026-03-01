import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
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

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load dashboard</div>

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
        <KpiCard label="Pending Products" value={k.pendingProducts} />
        <KpiCard label="Total Orders" value={k.totalOrders} />
        <KpiCard label="Shipped" value={k.ordersByStatus?.SHIPPED || 0} />
        <KpiCard label="Delivered" value={k.ordersByStatus?.DELIVERED || 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur overflow-hidden"
        >
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Orders by Status</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur"
        >
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Recent Orders</div>
          {ordersQuery.isLoading ? (
            <div className="mt-4 text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
          ) : ordersQuery.isError ? (
            <div className="mt-4 text-sm text-[hsl(var(--muted-fg))]">Failed to load orders</div>
          ) : (
            <div className="mt-4">
              <RecentOrdersTable orders={ordersQuery.data || []} />
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur"
      >
        <div className="text-sm font-medium text-[hsl(var(--fg))]">Orders by Month</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="rgba(113,113,122,0.9)" />
              <YAxis stroke="rgba(113,113,122,0.9)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="orders" fill="#18181b" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
