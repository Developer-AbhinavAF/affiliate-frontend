import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bolt, Dumbbell, Shirt } from 'lucide-react'

import { FeaturedProducts } from './partials/FeaturedProducts'

function CategoryTile({ to, title, subtitle, icon: Icon, gradient }) {
  return (
    <Link to={to} className="group">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur ${gradient}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-white">{title}</div>
            <div className="text-sm text-white/70">{subtitle}</div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/30">
            <Icon className="h-6 w-6 text-white/80" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/90">
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur md:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl font-semibold leading-tight text-white md:text-5xl"
        >
          Shop smarter with
          <span className="bg-linear-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent"> TrendKart</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
          Multi-vendor e-commerce with fast search, smooth UI, and COD checkout. Discover products across categories
          and track your orders in real time.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/category/electrical"
            className="rounded-full bg-linear-to-r from-indigo-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(99,102,241,0.25)] transition hover:opacity-95"
          >
            Shop now
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
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
