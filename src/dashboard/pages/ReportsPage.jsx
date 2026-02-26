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
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Reports (CSV)</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Download CSV exports for operations and accounting.</div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={async () => {
            try {
              await downloadCsv('/api/reports/orders', 'orders.csv')
              push('Downloaded orders.csv')
            } catch {
              push('Download failed')
            }
          }}
          className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
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
          className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Download Products CSV
        </button>

        <button
          onClick={async () => {
            try {
              await downloadCsv('/api/reports/sellers', 'sellers.csv')
              push('Downloaded sellers.csv')
            } catch {
              push('Download failed')
            }
          }}
          className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-2 text-sm text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Download Sellers CSV
        </button>
      </div>
    </div>
  )
}
