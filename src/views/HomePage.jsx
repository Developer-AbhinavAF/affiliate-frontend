import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bolt, Dumbbell, Shirt } from 'lucide-react'

import { useGsapReveal } from '../lib/gsap'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { ProductCard, ProductCardSkeleton } from '../ui/ProductCard'

function CategoryTile({ to, title, subtitle, icon: Icon, gradient }) {
  return (
    <Link to={to} className="group">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96, rotateX: 4 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -10, scale: 1.02, rotateX: 6, rotateY: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--card))]/80 dark:shadow-[0_18px_45px_rgba(0,0,0,0.7)] ${gradient}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-[hsl(var(--fg))]">{title}</div>
            <div className="text-sm text-[hsl(var(--muted-fg))]">{subtitle}</div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
            <Icon className="h-6 w-6 text-[hsl(var(--fg))]" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--fg))]">
          Explore
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </motion.div>
    </Link>
  )
}

function HeroCarousel() {
  const slides = [
    {
      title: 'Modern shopping, curated daily',
      desc: 'Fresh picks and trending deals across categories.',
    },
    {
      title: 'Smooth checkout, faster buying',
      desc: 'Better UI, cleaner navigation, quick discovery.',
    },
    {
      title: 'Explore by category in seconds',
      desc: 'Electronics, supplements, fashion — all in one place.',
    },
  ]

  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-6 shadow-sm backdrop-blur md:p-8">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="text-lg font-semibold text-[hsl(var(--fg))] md:text-xl">{slides[idx].title}</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted-fg))] md:text-base">{slides[idx].desc}</div>
        </motion.div>

        <div className="mt-5 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 w-2 rounded-full transition ${i === idx ? 'bg-[hsl(var(--fg))]' : 'bg-black/20 dark:bg-white/25'}`}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function HomeCategoryRow({ categoryKey, title, subtitle }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-category', categoryKey],
    queryFn: async () => {
      const res = await api.get('/api/products', {
        // Backend only allows limit <= 50
        params: { category: categoryKey, limit: 40, page: 1 },
      })
      return res.data
    },
  })

  const [visibleCount, setVisibleCount] = useState(10)
  const listRef = useRef(null)

  const items = data?.items || []
  const safeVisible = Math.min(visibleCount, items.length)
  const visibleItems = items.slice(0, safeVisible)

  useEffect(() => {
    setVisibleCount(10)
  }, [categoryKey])

  useEffect(() => {
    if (!items.length) return
    if (safeVisible >= items.length) return

    const id = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(items.length, c + 10))
    }, 1200)

    return () => window.clearTimeout(id)
  }, [items.length, safeVisible])

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
    }, 5000)

    return () => window.clearInterval(id)
  }, [visibleItems.length])

  return (
    <div className="space-y-3" data-gsap>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex items-end justify-between"
      >
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
            {categoryKey}
          </div>
          <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-400">{subtitle}</div>
        </div>
        <motion.div whileHover={{ x: 2, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to={`/category/${categoryKey}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </motion.div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: 5 }).map((_, idx) => (
            <motion.div
              key={idx}
              className="w-[82%] shrink-0 snap-center sm:w-[58%] lg:w-[32%]"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.03 }}
            >
              <ProductCardSkeleton />
            </motion.div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-zinc-700 dark:text-zinc-400">Failed to load products</div>
      ) : visibleItems.length === 0 ? (
        <div className="text-sm text-zinc-700 dark:text-zinc-400">No products in this category yet</div>
      ) : (
        <div
          ref={listRef}
          className="flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
        >
          {visibleItems.map((p, idx) => (
            <motion.div
              key={p._id}
              className="w-[88%] shrink-0 snap-center sm:w-[58%] lg:w-[32%]"
              initial={{ opacity: 0, y: 18, scale: 0.94, rotateY: -8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: idx * 0.03 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function HomePage() {
  const ref = useRef(null)
  useGsapReveal(ref, { start: 'top 80%', stagger: 0.06 })

  return (
    <div ref={ref} className="space-y-10 m-2">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-[hsl(var(--border))] dark:bg-linear-to-br dark:from-[hsl(var(--card))] dark:to-[hsl(var(--muted))] dark:shadow-[0_20px_55px_rgba(0,0,0,0.7)] md:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/5 blur-3xl dark:bg-white/10" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-black/10 blur-3xl dark:bg-white/10" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-semibold leading-tight text-[hsl(var(--fg))] md:text-5xl"
          data-gsap
        >
          Shop smarter with
          <span className="text-[hsl(var(--fg))]"> TrendKart</span>
        </motion.h1>

        <div className="mt-6 flex flex-wrap gap-3" data-gsap>
          <Link
            to="/category/electrical"
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            Shop now
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            Create account
          </Link>
        </div>

        <div data-gsap>
          <HeroCarousel />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3" data-gsap>
        <CategoryTile
          to="/category/electrical"
          title="Electrical"
          subtitle="Smart home, power, accessories"
          icon={Bolt}
          gradient=""
        />
        <CategoryTile
          to="/category/supplements"
          title="Gym Supplements"
          subtitle="Protein, recovery, performance"
          icon={Dumbbell}
          gradient=""
        />
        <CategoryTile
          to="/category/clothes_men"
          title="Clothes"
          subtitle="Men, women & kids"
          icon={Shirt}
          gradient=""
        />
      </div>

      <div className="space-y-8">
        <HomeCategoryRow categoryKey="electrical" title="Electrical" subtitle="Smart home, power, accessories" />
        <HomeCategoryRow categoryKey="supplements" title="Gym Supplements" subtitle="Protein, recovery, performance" />
        <HomeCategoryRow categoryKey="clothes_men" title="Men's Clothing" subtitle="Athletic + streetwear picks" />
        <HomeCategoryRow categoryKey="clothes_women" title="Women's Clothing" subtitle="Performance + comfort picks" />
        <HomeCategoryRow categoryKey="clothes_kids" title="Kids' Clothing" subtitle="Fun, comfy daily essentials" />
      </div>
    </div>
  )
}
