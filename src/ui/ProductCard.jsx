import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Star } from 'lucide-react'

import logoAcer from '../assets/marketplaces/acer.svg'
import logoAmazon from '../assets/marketplaces/amazon.svg'
import logoFlipkart from '../assets/marketplaces/Flipkart.png'
import logoHp from '../assets/marketplaces/hp.png'
import logoPuma from '../assets/marketplaces/puma.svg'

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
  const buyUrl = product?.buyLink || product?.affiliateUrl || ''
  const imageUrl = (() => {
    if (product?.imageUrl) return product.imageUrl
    if (Array.isArray(product?.images) && product.images.length) {
      const first = product.images.find(Boolean)
      if (typeof first === 'string') return first
      if (first?.url) return first.url
    }
    return ''
  })()

  const source =
    product?.sourceCompany ||
    (Array.isArray(product?.tags) ? product.tags.find((t) => /amazon|flipkart|myntra|ajio|shopsy|puma|acer|muscleblaze|nutrabay|hp/i.test(String(t))) : '')

  const sourceLabel = (() => {
    const s = String(source || '').toLowerCase()
    if (s.includes('flipkart')) return 'Flipkart'
    if (s.includes('amazon')) return 'Amazon'
    if (s.includes('myntra')) return 'Myntra'
    if (s.includes('ajio')) return 'Ajio'
    if (s.includes('shopsy')) return 'Shopsy'
    if (s.includes('puma')) return 'Puma'
    if (s.includes('acer')) return 'Acer'
    if (s.includes('muscleblaze')) return 'MuscleBlaze'
    if (s.includes('nutrabay')) return 'Nutrabay'
    if (s === 'hp' || s.includes(' hp')) return 'HP'
    if (s.includes('custom')) return 'Custom'
    return ''
  })()

  const sourceLogo = (() => {
    const s = String(sourceLabel || '').toLowerCase()
    if (!s) return null
    const meta = {
      flipkart: { bg: 'bg-[#1f4fd6]', src: logoFlipkart },
      amazon: { bg: 'bg-[#111827]', src: logoAmazon },
      myntra: { bg: 'bg-[#ff3f6c]', src: '' },
      ajio: { bg: 'bg-[#0f172a]', src: '' },
      shopsy: { bg: 'bg-[#6d28d9]', src: '' },
      puma: { bg: 'bg-[#111827]', src: logoPuma },
      acer: { bg: 'bg-[#16a34a]', src: logoAcer },
      muscleblaze: { bg: 'bg-[#f97316]', src: '' },
      nutrabay: { bg: 'bg-[#0ea5e9]', src: '' },
      hp: { bg: 'bg-[#2563eb]', src: logoHp },
      custom: { bg: 'bg-[hsl(var(--muted))]', src: '' },
    }

    const key =
      s === 'hp'
        ? 'hp'
        : s.includes('muscleblaze')
          ? 'muscleblaze'
          : s.includes('nutrabay')
            ? 'nutrabay'
            : s
    const cfg = meta[key] || meta.custom
    const fallbackText = s === 'hp' ? 'HP' : sourceLabel.slice(0, 1).toUpperCase()

    const src = cfg.src

    return (
      <span className={`relative inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm ${cfg.bg}`}>
        <span className="text-[10px] font-semibold text-white">{fallbackText}</span>
        {src ? (
          <img
            src={src}
            alt={sourceLabel}
            className="absolute inset-0 m-auto h-3.5 w-3.5"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
      </span>
    )
  })()

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
            src={imageUrl || undefined}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          {sourceLabel ? (
            <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 text-xs text-[hsl(var(--fg))] shadow-sm backdrop-blur">
              {sourceLogo}
              <span className="min-w-0 truncate">{sourceLabel}</span>
            </div>
          ) : null}
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 text-xs text-[hsl(var(--fg))] shadow-sm backdrop-blur">
            <Star className="h-3.5 w-3.5 text-amber-300" />
            {product.rating?.toFixed?.(1) ?? '4.6'}
          </div>
        </div>

        <div className="space-y-2 p-4 min-w-0">
          <div className="line-clamp-1 text-base font-semibold text-[hsl(var(--fg))]">{product.title}</div>
          <div className="line-clamp-2 text-sm text-[hsl(var(--muted-fg))]">{product.description}</div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="shrink-0 text-sm font-medium text-[hsl(var(--fg))]">
              {product.currency || 'USD'} {Number(product.price).toFixed(2)}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Link
                to={`/product/${product._id}`}
                className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs text-[hsl(var(--fg))] transition hover:bg-black/5"
              >
                View
              </Link>
              <a
                href={buyUrl || undefined}
                target={buyUrl ? '_blank' : undefined}
                rel={buyUrl ? 'noreferrer' : undefined}
                aria-disabled={!buyUrl}
                className={`inline-flex gap-1 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs text-[hsl(var(--fg))] transition hover:bg-black/5 ${
                  buyUrl ? '' : 'pointer-events-none opacity-50'
                }`}
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
