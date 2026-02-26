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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="text-sm font-medium text-white">Reports (CSV)</div>
      <div className="mt-1 text-sm text-white/60">Download CSV exports for operations and accounting.</div>

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
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
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
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
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
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          Download Sellers CSV
        </button>
      </div>
    </div>
  )
}
