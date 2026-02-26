import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Star } from 'lucide-react'

export function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={product.title}
          src={product.imageUrl}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs text-white backdrop-blur">
          <Star className="h-3.5 w-3.5 text-amber-300" />
          {product.rating?.toFixed?.(1) ?? '4.6'}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="line-clamp-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{product.title}</div>
        <div className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{product.description}</div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {product.currency || 'USD'} {Number(product.price).toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product._id}`}
              className="rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              View
            </Link>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-sm bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Buy
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
