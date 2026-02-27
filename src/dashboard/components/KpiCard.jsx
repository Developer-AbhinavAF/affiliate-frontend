import { motion } from 'framer-motion'

export function KpiCard({ label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-5 shadow-sm backdrop-blur"
    >
      <div className="text-xs uppercase tracking-wide text-[hsl(var(--muted-fg))]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[hsl(var(--fg))]">{value}</div>
      {sub ? <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">{sub}</div> : null}
    </motion.div>
  )
}
