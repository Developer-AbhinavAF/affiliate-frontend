import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../lib/api'

export function SellerProductsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['seller', 'products'],
    queryFn: async () => {
      const res = await api.get('/api/products/mine')
      return res.data.items || []
    },
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load products</div>

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="text-sm font-medium text-white">My Products</div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="text-white/60">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Status</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="py-2 text-white/80">{p.title}</td>
                <td className="py-2 text-white/70">{p.category}</td>
                <td className="py-2 text-white/80">₹ {Math.round(p.price).toLocaleString()}</td>
                <td className="py-2 text-white/80">{p.stock}</td>
                <td className="py-2 text-white/80">{p.status}</td>
                <td className="py-2 text-white/70">{new Date(p.createdAt).toLocaleString()}</td>
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
  )
}
