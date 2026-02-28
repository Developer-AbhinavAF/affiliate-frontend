import { motion } from 'framer-motion'
import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

async function downloadCsv(path, filename) {
  const res = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const { push } = useToast()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur"
    >
      <div className="text-sm font-medium text-[hsl(var(--fg))]">Reports (CSV)</div>
      <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Download CSV exports for operations and accounting.</div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          onClick={async () => {
            try {
              await downloadCsv('/api/reports/orders', 'orders.csv')
              push('Downloaded orders.csv')
            } catch {
              push('Download failed')
            }
          }}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
        >
          Download Orders CSV
        </button>

        <button
          onClick={async () => {
            try {
              await downloadCsv('/api/reports/products', 'products.csv')
              push('Downloaded products.csv')
            } catch {
              push('Download failed')
            }
          }}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
        >
          Download Products CSV
        </button>
      </div>
    </motion.div>
  )
}
