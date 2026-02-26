import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, ArrowLeft } from 'lucide-react'

import { api } from '../lib/api'

export function ProductPage() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load product</div>

  const p = data.item
  const heroImage = p?.imageUrl || p?.images?.[0]?.url

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {heroImage ? <img src={heroImage} alt={p.title} className="h-full w-full object-cover" /> : null}
        </motion.div>

        <div className="space-y-4">
          <div>
            <div className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{p.title}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{p.description}</div>
          </div>

          <div className="flex items-center justify-between rounded-sm border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {p.currency || 'USD'} {Number(p.price).toFixed(2)}
            </div>
            <a
              href={p.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go to store
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-sm border border-zinc-200 bg-white p-5 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
            This is an affiliate link. You’ll be redirected to a third-party store to complete your purchase.
          </div>
        </div>
      </div>
    </div>
  )
}
