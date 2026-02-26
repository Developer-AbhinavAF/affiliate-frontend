import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { ProductCard } from '../../ui/ProductCard'

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => {
      const res = await api.get('/api/products?limit=8&page=1')
      return res.data
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Featured</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Fresh picks across categories</div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
      ) : isError ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load products</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
