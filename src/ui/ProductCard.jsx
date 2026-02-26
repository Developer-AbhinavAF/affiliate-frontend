import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Star } from 'lucide-react'

export function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={product.title}
          src={product.imageUrl}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/80 backdrop-blur">
          <Star className="h-3.5 w-3.5 text-yellow-300" />
          {product.rating?.toFixed?.(1) ?? '4.6'}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="line-clamp-1 text-base font-semibold text-white">{product.title}</div>
        <div className="line-clamp-2 text-sm text-white/70">{product.description}</div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-white/90">
            {product.currency || 'USD'} {Number(product.price).toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product._id}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 transition hover:bg-white/10"
            >
              View
            </Link>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-95"
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
