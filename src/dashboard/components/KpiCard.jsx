import { motion } from 'framer-motion'

export function KpiCard({ label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-sm border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
      {sub ? <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{sub}</div> : null}
    </motion.div>
  )
}
