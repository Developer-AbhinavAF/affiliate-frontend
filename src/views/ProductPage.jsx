import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ExternalLink, Heart, Share2, ShieldCheck, Star, Truck } from 'lucide-react'

import { useToast } from '../components/Toaster/Toaster'
import { useAuth } from '../state/auth'
import { api } from '../lib/api'
import { ProductCard, ProductCardSkeleton } from '../ui/ProductCard'

function formatMoney(currency, value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return `${currency || 'USD'} ${n.toFixed(2)}`
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function getImageUrls(p) {
  const raw = []
  if (p?.imageUrl) raw.push(p.imageUrl)
  if (Array.isArray(p?.images)) {
    for (const it of p.images) {
      if (typeof it === 'string') raw.push(it)
      else if (it?.url) raw.push(it.url)
    }
  }
  return Array.from(new Set(raw.filter(Boolean)))
}

function extractHighlights(description, max = 6) {
  if (!description) return []
  const parts = String(description)
    .split(/[.•\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.slice(0, max)
}

function ProductPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-32 rounded bg-black/10 dark:bg-white/10" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="aspect-square animate-pulse bg-zinc-200/80 dark:bg-zinc-800/60" />
            <div className="flex gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 w-14 animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800/60" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <div className="space-y-2">
            <div className="h-8 w-4/5 animate-pulse rounded bg-black/10 dark:bg-white/10" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-black/10 dark:bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-12 animate-pulse rounded-2xl bg-black/10 dark:bg-white/10" />
            <div className="h-12 animate-pulse rounded-2xl bg-black/10 dark:bg-white/10" />
          </div>
          <div className="h-40 animate-pulse rounded-3xl bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    </div>
  )
}

function RatingStars({ value }) {
  const v = clamp(Number(value) || 0, 0, 5)
  const full = Math.floor(v)
  const half = v - full >= 0.5
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${v.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full
        const isHalf = i === full && half
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${filled || isHalf ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`}
            fill={filled || isHalf ? 'currentColor' : 'none'}
          />
        )
      })}
      <div className="ml-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{v.toFixed(1)}</div>
    </div>
  )
}

function SpecsTable({ specs }) {
  const entries = Object.entries(specs || {})
  if (!entries.length) {
    return <div className="text-sm text-zinc-700 dark:text-zinc-400">No specifications available.</div>
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/30">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([k, v], idx) => (
            <tr key={k} className={idx % 2 === 0 ? 'bg-black/2 dark:bg-white/3' : ''}>
              <td className="w-[40%] px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{k}</td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Offers({ offers }) {
  const [open, setOpen] = useState(false)
  const shown = open ? offers : offers.slice(0, 3)
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Offers & coupons</div>
        {offers.length > 3 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-expanded={open}
          >
            {open ? 'View less' : 'View more'}
            <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
          </button>
        ) : null}
      </div>
      <div className="mt-4 space-y-3">
        {shown.map((o, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200">
            <div className="font-medium">{o.title}</div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{o.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewsBlock({ rating, totalReviews, reviews }) {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('helpful')

  const list = Array.isArray(reviews) ? reviews : []

  const filtered = useMemo(() => {
    let out = list
    if (filter !== 'all') out = out.filter((r) => Number(r.rating) === Number(filter))
    if (sort === 'recent') out = [...out].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (sort === 'high') out = [...out].sort((a, b) => Number(b.rating) - Number(a.rating))
    if (sort === 'low') out = [...out].sort((a, b) => Number(a.rating) - Number(b.rating))
    return out
  }, [filter, list, sort])

  const breakdown = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of list) {
      const v = clamp(Math.round(Number(r.rating) || 0), 1, 5)
      counts[v] += 1
    }
    return counts
  }, [list])

  const total = list.length || Number(totalReviews) || 0

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 lg:col-span-5">
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Ratings summary</div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-4xl font-semibold text-zinc-950 dark:text-zinc-50">{(Number(rating) || 0).toFixed(1)}</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{total ? `${total} ratings & reviews` : 'No ratings yet'}</div>
            </div>
            <RatingStars value={rating} />
          </div>

          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((s) => {
              const c = breakdown[s] || 0
              const pct = total ? Math.round((c / total) * 100) : 0
              return (
                <div key={s} className="flex items-center gap-3 text-xs">
                  <div className="w-10 font-medium text-zinc-700 dark:text-zinc-300">{s}★</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-10 text-right text-zinc-600 dark:text-zinc-400">{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Reviews</div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter by rating"
              >
                <option value="all">All ratings</option>
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
                <option value="2">2★</option>
                <option value="1">1★</option>
              </select>
              <select
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort reviews"
              >
                <option value="helpful">Most helpful</option>
                <option value="recent">Recent</option>
                <option value="high">High rating</option>
                <option value="low">Low rating</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-sm text-zinc-700 dark:text-zinc-400">No reviews to show.</div>
            ) : (
              filtered.map((r, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{r.userName || 'Customer'}</div>
                      {r.verified ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </div>
                      ) : null}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {r.date ? new Date(r.date).toLocaleDateString() : ''}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <RatingStars value={r.rating} />
                    <button
                      type="button"
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Helpful
                    </button>
                  </div>

                  {r.title ? <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{r.title}</div> : null}
                  {r.comment ? <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</div> : null}

                  {Array.isArray(r.images) && r.images.length ? (
                    <div className="mt-3 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {r.images.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt="Customer uploaded"
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-xl border border-zinc-200 object-cover dark:border-zinc-800"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const { push } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState('description')
  const [wish, setWish] = useState(false)
  const mainRef = useRef(null)
  const pointerStart = useRef(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })

  const p = data?.item

  const images = useMemo(() => getImageUrls(p), [p])
  const imageSafeIdx = clamp(activeImage, 0, Math.max(0, images.length - 1))
  const mainImage = images[imageSafeIdx]

  const brand = p?.brand || p?.vendorName || p?.storeName || '—'
  const rating = p?.rating ?? (Array.isArray(p?.reviews) && p.reviews.length ? p.reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / p.reviews.length : 0)
  const totalReviews = p?.totalReviews ?? p?.totalRatings ?? p?.reviews?.length ?? 0
  const highlights = p?.highlights?.length ? p.highlights : extractHighlights(p?.description, 6)

  const inStock = typeof p?.stock === 'number' ? p.stock > 0 : p?.status ? String(p.status).toLowerCase() !== 'out_of_stock' : true

  const currency = p?.currency || 'USD'
  const price = p?.price
  const originalPrice = p?.originalPrice ?? p?.mrp
  const discountPct =
    Number(originalPrice) > 0 && Number(price) > 0 ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100) : null

  const specs = useMemo(() => {
    if (p?.specifications && typeof p.specifications === 'object') return p.specifications
    return {
      Brand: brand !== '—' ? brand : 'N/A',
      Category: p?.category || 'N/A',
      Price: formatMoney(currency, price),
      Rating: rating ? rating.toFixed(1) : 'N/A',
    }
  }, [brand, currency, p?.category, p?.specifications, price, rating])

  const offers = useMemo(
    () => [
      { title: 'Bank Offer', desc: 'Get extra discount on select cards & UPI payments.' },
      { title: 'Exchange Offer', desc: 'Save more when you exchange an eligible item.' },
      { title: 'Special Price', desc: 'Limited time deal on this product.' },
      { title: 'No-cost EMI', desc: 'Available on select cards for eligible orders.' },
      { title: 'Partner coupon', desc: 'Apply coupons at checkout for additional savings.' },
    ],
    []
  )

  const userKey = useMemo(() => {
    if (!user) return null
    return user.id || user._id || user.email || user.username || 'guest'
  }, [user])

  useEffect(() => {
    setActiveImage(0)
  }, [id])

  useEffect(() => {
    if (p?.title) document.title = `${p.title} | TrendKart`
  }, [p?.title])

  const { data: relatedData } = useQuery({
    queryKey: ['related', p?.category],
    queryFn: async () => {
      const res = await api.get('/api/products', { params: { category: p.category, limit: 12, page: 1 } })
      return res.data
    },
    enabled: Boolean(p?.category),
  })

  const related = (relatedData?.items || []).filter((x) => x?._id !== id)

  useEffect(() => {
    if (!userKey || !p) {
      setWish(false)
      return
    }
    try {
      const raw = localStorage.getItem(`wishlist_${userKey}`)
      const parsed = raw ? JSON.parse(raw) : []
      const exists = Array.isArray(parsed)
        ? parsed.some((it) => it?.product?._id === p._id || it?._id === p._id)
        : false
      setWish(Boolean(exists))
    } catch {
      setWish(false)
    }
  }, [p, userKey])

  if (isLoading) return <ProductPageSkeleton />
  if (isError || !p) return <div className="text-sm text-zinc-700 dark:text-zinc-400">Failed to load product</div>

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: p.title, url })
        return
      }
    } catch {
      // ignore
    }
    try {
      await navigator.clipboard.writeText(url)
      push('Link copied')
    } catch {
      push('Could not copy link')
    }
  }

  const goToLoginWithRedirect = () => {
    const redirect = encodeURIComponent(location.pathname + location.search)
    navigate(`/login?redirect=${redirect}`)
  }

  const handleBuyNow = () => {
    const buyUrl = p?.buyLink || p?.affiliateUrl || ''
    if (!buyUrl) {
      push('No store link available')
      return
    }
    window.open(buyUrl, '_blank', 'noreferrer')
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return
    pointerStart.current = { x: e.clientX, y: e.clientY, t: Date.now() }
  }

  const onPointerUp = (e) => {
    const s = pointerStart.current
    pointerStart.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dy) > 40) return
    if (Math.abs(dx) < 55) return
    if (!images.length) return
    if (dx < 0) setActiveImage((i) => clamp(i + 1, 0, images.length - 1))
    else setActiveImage((i) => clamp(i - 1, 0, images.length - 1))
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs + back */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Link to={-1} className="inline-flex items-center gap-2 text-sm text-zinc-800 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            <Link to="/" className="hover:underline">
              Home
            </Link>{' '}
            /{' '}
            {p?.category ? (
              <Link to={`/category/${p.category}`} className="hover:underline">
                {p.category}
              </Link>
            ) : (
              <span>Products</span>
            )}{' '}
            / <span className="text-zinc-900 dark:text-zinc-200">{p.title}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Images */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 shadow-[0_20px_55px_rgba(15,23,42,0.12)] dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-[0_20px_55px_rgba(0,0,0,0.7)]"
          >
            <div
              ref={mainRef}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              className="group relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950/40"
              aria-label="Product image gallery"
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.18]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-zinc-600 dark:text-zinc-400">No image</div>
              )}

              {images.length ? (
                <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                  {imageSafeIdx + 1}/{images.length}
                </div>
              ) : null}
            </div>

            {/* Thumbnails */}
            {images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((src, idx) => {
                  const active = idx === imageSafeIdx
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition ${
                        active ? 'border-zinc-900 ring-2 ring-zinc-900/20 dark:border-zinc-200 dark:ring-zinc-200/20' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      aria-label={`Select image ${idx + 1}`}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 hover:scale-[1.06]" />
                    </button>
                  )
                })}
              </div>
            ) : null}
          </motion.div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
              <div className="flex items-center gap-2 font-semibold">
                <Truck className="h-4 w-4" />
                Delivery
              </div>
              <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Estimated delivery in 3–7 days</div>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Payments
              </div>
              <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">UPI, Cards, Wallets, EMI options</div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-[0_20px_55px_rgba(0,0,0,0.7)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{p.title}</div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
                  Brand: <span className="font-medium text-zinc-900 dark:text-zinc-200">{brand}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <RatingStars value={rating} />
                  <div className="text-sm text-zinc-700 dark:text-zinc-400">
                    {totalReviews ? `${totalReviews} ratings & reviews` : 'No reviews yet'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!user) {
                      goToLoginWithRedirect()
                      return
                    }
                    if (!userKey) {
                      goToLoginWithRedirect()
                      return
                    }
                    try {
                      const storageKey = `wishlist_${userKey}`
                      const raw = localStorage.getItem(storageKey)
                      const parsed = raw ? JSON.parse(raw) : []
                      let items = Array.isArray(parsed) ? parsed : []
                      const idx = items.findIndex((it) => it.product?._id === p._id || it?._id === p._id)
                      let inWishlist
                      if (idx >= 0) {
                        items.splice(idx, 1)
                        inWishlist = false
                      } else {
                        items.push({ product: p })
                        inWishlist = true
                      }
                      localStorage.setItem(storageKey, JSON.stringify(items))
                      setWish(inWishlist)
                      push(inWishlist ? 'Added to wishlist' : 'Removed from wishlist')
                      await queryClient.invalidateQueries({ queryKey: ['customer', 'wishlist'] })
                    } catch {
                      push('Failed to update wishlist')
                    }
                  }}
                  className={`grid h-10 w-10 place-items-center rounded-2xl border bg-white/80 text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-800 ${
                    wish ? 'border-rose-300 text-rose-600 dark:border-rose-500/40 dark:text-rose-300' : 'border-zinc-200'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className="h-4 w-4" fill={wish ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-zinc-200 bg-white/80 text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Share product"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{formatMoney(currency, price)}</div>
                {originalPrice ? (
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <div className="text-zinc-500 line-through dark:text-zinc-500">{formatMoney(currency, originalPrice)}</div>
                    {typeof discountPct === 'number' ? (
                      <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {discountPct}% OFF
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={`text-sm font-semibold ${inStock ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                {inStock ? 'In stock' : 'Out of stock'}
              </div>
            </div>

            {highlights.length ? (
              <div className="mt-5 rounded-3xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Highlights</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                  {highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-200" />
                      <span className="min-w-0">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={async () => {
                  if (!user) {
                    goToLoginWithRedirect()
                    return
                  }
                  try {
                    if (!userKey) {
                      goToLoginWithRedirect()
                      return
                    }
                    const storageKey = `cart_${userKey}`
                    const raw = localStorage.getItem(storageKey)
                    const parsed = raw ? JSON.parse(raw) : []
                    const items = Array.isArray(parsed) ? parsed : []
                    const idx = items.findIndex((it) => it.product?._id === p._id)
                    if (idx >= 0) {
                      items[idx].quantity += 1
                    } else {
                      items.push({ product: p, quantity: 1 })
                    }
                    localStorage.setItem(storageKey, JSON.stringify(items))
                    push('Added to cart')
                    await queryClient.invalidateQueries({ queryKey: ['customer', 'cart'] })
                  } catch (e) {
                    push('Failed to add to cart')
                  }
                }}
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-50 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                disabled={!inStock}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-900 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-200 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Buy Now
                <ExternalLink className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>

          <Offers offers={offers} />

          {/* Tabs */}
          <div className="rounded-3xl border border-zinc-200 bg-white/90 p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'qa', label: 'Q&A' },
              ].map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`relative rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      active ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900' : 'text-zinc-800 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            <div className="p-4">
              {tab === 'description' ? (
                <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{p.description || 'No description available.'}</div>
              ) : null}

              {tab === 'specs' ? <SpecsTable specs={specs} /> : null}

              {tab === 'reviews' ? (
                <ReviewsBlock rating={rating} totalReviews={totalReviews} reviews={p.reviews} />
              ) : null}

              {tab === 'qa' ? (
                <div className="text-sm text-zinc-700 dark:text-zinc-400">
                  No questions yet. Ask about sizing, warranty, delivery, or compatibility.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Similar Products</div>
            <div className="text-sm text-zinc-700 dark:text-zinc-400">More items you might like</div>
          </div>
          {p?.category ? (
            <Link
              to={`/category/${p.category}`}
              className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              View category
            </Link>
          ) : null}
        </div>

        {relatedData ? (
          related.length ? (
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">
              {related.map((rp) => (
                <div key={rp._id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[24%]">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-zinc-700 dark:text-zinc-400">No related products found.</div>
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
