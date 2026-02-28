import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import { api } from '../lib/api'
import { ProductCard, ProductCardSkeleton } from '../ui/ProductCard'

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
  const [brand, setBrand] = useState('')
  const [sourceCompany, setSourceCompany] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [bankOffer, setBankOffer] = useState(false)
  const [exchangeOffer, setExchangeOffer] = useState(false)
  const [emiAvailable, setEmiAvailable] = useState(false)
  const [partnerCoupon, setPartnerCoupon] = useState(false)

  const meta = titles[category] || { title: 'Products', subtitle: '' }

  const queryKey = useMemo(
    () => [
      'products',
      category,
      q,
      brand,
      sourceCompany,
      minPrice,
      maxPrice,
      minRating,
      bankOffer,
      exchangeOffer,
      emiAvailable,
      partnerCoupon,
    ],
    [category, q, brand, sourceCompany, minPrice, maxPrice, minRating, bankOffer, exchangeOffer, emiAvailable, partnerCoupon]
  )

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get('/api/products', {
        // Backend only allows limit <= 50
        // 4 columns × 7 rows (28) still fits comfortably within this
        params: {
          category,
          q: q || undefined,
          brand: brand || undefined,
          sourceCompany: sourceCompany || undefined,
          minPrice: minPrice === '' ? undefined : Number(minPrice),
          maxPrice: maxPrice === '' ? undefined : Number(maxPrice),
          minRating: minRating === '' ? undefined : Number(minRating),
          bankOffer: bankOffer ? true : undefined,
          exchangeOffer: exchangeOffer ? true : undefined,
          emiAvailable: emiAvailable ? true : undefined,
          partnerCoupon: partnerCoupon ? true : undefined,
          limit: 50,
          page: 1,
        },
      })
      return res.data
    },
    enabled: Boolean(category),
  })

  const listRef = useRef(null)

  const perPage = 28 // 4 columns × 7 rows
  const items = data?.items || []

  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [category, q, brand, sourceCompany, minPrice, maxPrice, minRating, bankOffer, exchangeOffer, emiAvailable, partnerCoupon])

  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const pageSafe = Math.min(page, totalPages)
  const start = (pageSafe - 1) * perPage
  const visibleItems = items.slice(start, start + perPage)

  useEffect(() => {
    if (!listRef.current || !visibleItems.length) return
    const container = listRef.current
    let idx = 0

    const id = window.setInterval(() => {
      if (!container.children.length) return
      idx = (idx + 1) % container.children.length
      const child = container.children[idx]
      if (!child) return
      const childLeft = child.offsetLeft
      const childWidth = child.offsetWidth
      const target =
        childLeft - container.clientWidth / 2 + childWidth / 2

      container.scrollTo({
        left: Math.max(0, target),
        behavior: 'smooth',
      })
    }, 4500)

    return () => window.clearInterval(id)
  }, [visibleItems.length])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
      >
        <div className="text-2xl font-semibold text-[hsl(var(--fg))]">{meta.title}</div>
        <div className="text-sm text-[hsl(var(--muted-fg))]">{meta.subtitle}</div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand (optional)"
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />

          <select
            value={sourceCompany}
            onChange={(e) => setSourceCompany(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:focus:border-zinc-700"
          >
            <option value="">All marketplaces</option>
            <option value="Amazon">Amazon</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Myntra">Myntra</option>
            <option value="Ajio">Ajio</option>
            <option value="Shopsy">Shopsy</option>
            <option value="Puma">Puma</option>
            <option value="Acer">Acer</option>
            <option value="MuscleBlaze">MuscleBlaze</option>
            <option value="Nutrabay">Nutrabay</option>
            <option value="HP">HP</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
            min="0"
            step="1"
            placeholder="Min price"
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
            min="0"
            step="1"
            placeholder="Max price"
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <input
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Min rating"
            className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[ 
            { key: 'bankOffer', label: 'Bank offer', value: bankOffer, setter: setBankOffer },
            { key: 'exchangeOffer', label: 'Exchange offer', value: exchangeOffer, setter: setExchangeOffer },
            { key: 'emiAvailable', label: 'EMI available', value: emiAvailable, setter: setEmiAvailable },
            { key: 'partnerCoupon', label: 'Partner coupon', value: partnerCoupon, setter: setPartnerCoupon },
          ].map((it) => (
            <label
              key={it.key}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm text-zinc-800 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200"
            >
              <input type="checkbox" checked={it.value} onChange={(e) => it.setter(e.target.checked)} />
              {it.label}
            </label>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.03 }}
            >
              <ProductCardSkeleton />
            </motion.div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load products</div>
      ) : visibleItems.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">No products found</div>
      ) : (
        <>
          {/* Mobile: 1 card per row, infinite horizontal columns with auto swipe */}
          <div
            ref={listRef}
            className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory md:hidden"
          >
            {visibleItems.map((p, idx) => (
              <motion.div
                key={p._id}
                className="w-[88%] shrink-0 snap-center"
                initial={{ opacity: 0, y: 18, scale: 0.94, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: idx * 0.03 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          {/* Desktop / tablet: 4 cards per row with pagination limited to 7 rows per page */}
          <div className="hidden grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 md:grid">
            {visibleItems.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20, scale: 0.96, rotateX: 6 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: idx * 0.02 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe === 1}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 shadow-sm transition enabled:hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:enabled:hover:bg-zinc-800 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1
                  const isActive = pageNumber === pageSafe
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-8 w-8 rounded-full text-sm transition ${
                        isActive
                          ? 'bg-zinc-900 text-zinc-50 shadow-sm dark:bg-zinc-50 dark:text-zinc-900'
                          : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe === totalPages}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 shadow-sm transition enabled:hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:enabled:hover:bg-zinc-800 disabled:opacity-50"
              >
                Next
              </button>

              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Page {pageSafe} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
