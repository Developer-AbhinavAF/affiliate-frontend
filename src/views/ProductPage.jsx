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

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load product</div>

  const p = data.item

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
        </motion.div>

        <div className="space-y-4">
          <div>
            <div className="text-3xl font-semibold text-white">{p.title}</div>
            <div className="mt-2 text-sm text-white/70">{p.description}</div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-base font-semibold text-white">
              {p.currency || 'USD'} {Number(p.price).toFixed(2)}
            </div>
            <a
              href={p.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(99,102,241,0.25)] transition hover:opacity-95"
            >
              Go to store
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            This is an affiliate link. You’ll be redirected to a third-party store to complete your purchase.
          </div>
        </div>
      </div>
    </div>
  )
}
