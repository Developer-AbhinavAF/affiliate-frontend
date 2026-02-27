import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { api } from '../../lib/api'
import { KpiCard } from '../components/KpiCard'
import { RecentOrdersTable } from '../components/RecentOrdersTable'

export function SellerDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'seller'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/seller/summary')
      return res.data
    },
  })

  const ordersQuery = useQuery({
    queryKey: ['orders', 'recent', 'seller'],
    queryFn: async () => {
      const res = await api.get('/api/orders', { params: { limit: 10 } })
      return res.data.items || []
    },
  })

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load dashboard</div>

  const k = data.kpis
  const series = data.monthly || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="My Products" value={k.myProducts} />
        <KpiCard label="My Orders" value={k.myOrders} />
        <KpiCard label="Gross Sales" value={`₹ ${Math.round(k.grossSales).toLocaleString()}`} />
        <KpiCard label="Commission Deducted" value={`₹ ${Math.round(k.commissionDeducted).toLocaleString()}`} />
      </div>

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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur"
      >
        <div className="text-sm font-medium text-[hsl(var(--fg))]">Monthly Sales</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0.08} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="sales" stroke="#18181b" fill="url(#sales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
