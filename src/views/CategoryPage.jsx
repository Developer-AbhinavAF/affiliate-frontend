import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { api } from '../lib/api'
import { ProductCard } from '../ui/ProductCard'

const titles = {
  electrical: { title: 'Electrical', subtitle: 'Smart home, power, accessories' },
  supplements: { title: 'Gym Supplements', subtitle: 'Protein, recovery, performance' },
  clothes_men: { title: "Men's Clothing", subtitle: 'Athletic + streetwear picks' },
  clothes_women: { title: "Women's Clothing", subtitle: 'Performance + comfort picks' },
  clothes_kids: { title: "Kids' Clothing", subtitle: 'Fun, comfy daily essentials' },
}

export function CategoryPage() {
  const { category } = useParams()
  const [q, setQ] = useState('')

  const meta = titles[category] || { title: 'Products', subtitle: '' }

  const queryKey = useMemo(() => ['products', category, q], [category, q])

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get('/api/products', {
        params: { category, q: q || undefined, limit: 24, page: 1 },
      })
      return res.data
    },
    enabled: Boolean(category),
  })

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{meta.title}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{meta.subtitle}</div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
      ) : isError ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load products</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
