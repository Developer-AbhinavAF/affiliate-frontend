import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Star } from 'lucide-react'

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
      <div className="aspect-4/3 bg-[hsl(var(--muted))]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-sm bg-[hsl(var(--muted))]" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded-sm bg-[hsl(var(--muted))]" />
          <div className="h-3 w-5/6 rounded-sm bg-[hsl(var(--muted))]" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-20 rounded-sm bg-[hsl(var(--muted))]" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-14 rounded-sm bg-[hsl(var(--muted))]" />
            <div className="h-7 w-14 rounded-sm bg-[hsl(var(--muted))]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductCard({ product }) {
  return (
    <div style={{ perspective: 1500 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -10, rotateX: 7, rotateY: -7 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="group overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 shadow-sm backdrop-blur transform-3d"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={product.title}
            src={product.imageUrl}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs text-white backdrop-blur">
            <Star className="h-3.5 w-3.5 text-amber-300" />
            {product.rating?.toFixed?.(1) ?? '4.6'}
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="line-clamp-1 text-base font-semibold text-[hsl(var(--fg))]">{product.title}</div>
          <div className="line-clamp-2 text-sm text-[hsl(var(--muted-fg))]">{product.description}</div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-medium text-[hsl(var(--fg))]">
              {product.currency || 'USD'} {Number(product.price).toFixed(2)}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product._id}`}
                className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs text-[hsl(var(--fg))] transition hover:bg-black/5"
              >
                View
              </Link>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs text-[hsl(var(--fg))] transition hover:bg-black/5"
              >
                Buy
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
