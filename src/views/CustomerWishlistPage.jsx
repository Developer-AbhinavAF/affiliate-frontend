import { useQuery } from '@tanstack/react-query'

import { api } from '../lib/api'
import { ProductCard } from '../ui/ProductCard'

export function CustomerWishlistPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', 'wishlist'],
    queryFn: async () => {
      const res = await api.get('/api/customer/wishlist')
      return res.data.items || []
    },
  })

  if (isLoading) return <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/70">Loading…</div>
  if (isError) return <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/70">Failed to load wishlist</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-lg font-semibold text-white">Wishlist</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
        {(data || []).length === 0 ? <div className="text-sm text-white/60">No items</div> : null}
      </div>
    </div>
  )
}
