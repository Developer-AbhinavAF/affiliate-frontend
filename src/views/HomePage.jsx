import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bolt, Dumbbell, Shirt } from 'lucide-react'

import { FeaturedProducts } from './partials/FeaturedProducts'

function CategoryTile({ to, title, subtitle, icon: Icon, gradient }) {
  return (
    <Link to={to} className="group">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className={`relative overflow-hidden rounded-sm border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${gradient}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-sm border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/30">
            <Icon className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Explore
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </motion.div>
    </Link>
  )
}

export function HomePage() {
  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-sm border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-zinc-900/10 blur-3xl dark:bg-white/10" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-zinc-900/5 blur-3xl dark:bg-white/10" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 md:text-5xl"
        >
          Shop smarter with
          <span className="text-zinc-900 dark:text-zinc-50"> TrendKart</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 md:text-lg">
          Multi-vendor e-commerce with fast search, smooth UI, and COD checkout. Discover products across categories
          and track your orders in real time.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/category/electrical"
            className="rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Shop now
          </Link>
          <Link
            to="/signup"
            className="rounded-sm border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <FeaturedProducts />
    </div>
  )
}
