import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../lib/api'

export function HelperManageProductsPage() {
  const [qInput, setQInput] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['helper', 'manage-products', q, status, page],
    queryFn: async () => {
      const res = await api.get('/api/products/manage/mine', {
        params: { q: q || undefined, status: status || undefined, page },
      })
      return res.data
    },
  })

  const { data: suggestData } = useQuery({
    queryKey: ['helper', 'manage-products-suggest', qInput],
    enabled: qInput.trim().length >= 2,
    queryFn: async () => {
      const res = await api.get('/api/products/manage/suggest', {
        params: { q: qInput.trim() },
      })
      return res.data
    },
  })

  const suggestions = suggestData?.items || []

  function runSearch(nextQ) {
    setQ(nextQ)
    setPage(1)
  }

  const rows = useMemo(() => data?.items || [], [data])

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load products</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">My Products</div>
          <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Your submitted products and their approval status.</div>
        </div>
        <Link
          to="/helper/products/new"
          className="w-full rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-center text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90 sm:w-auto"
        >
          Add Product
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <div className="flex gap-2">
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  runSearch(qInput.trim())
                }
              }}
              placeholder="Type full title and press Enter"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            />
            <button
              type="button"
              onClick={() => runSearch(qInput.trim())}
              className="shrink-0 rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90"
            >
              Search
            </button>
          </div>

          {qInput.trim().length >= 2 && suggestions.length ? (
            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
              {suggestions.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    setQInput(s.title)
                    runSearch(s.title)
                  }}
                  className="block w-full truncate px-4 py-2 text-left text-sm text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {s.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
        >
          <option value="">All statuses</option>
          <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 backdrop-blur">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-[hsl(var(--muted-fg))]">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t border-[hsl(var(--border))]">
                <td className="py-2 text-[hsl(var(--fg))]">{p.title}</td>
                <td className="py-2 text-[hsl(var(--muted-fg))]">{p.category}</td>
                <td className="py-2 text-[hsl(var(--fg))]">₹ {Math.round(p.price).toLocaleString()}</td>
                <td className="py-2 text-[hsl(var(--fg))]">{p.stock}</td>
                <td className="py-2 text-[hsl(var(--fg))]">{p.status}</td>
                <td className="py-2">
                  <Link
                    to={`/helper/products/${p._id}/edit`}
                    className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[hsl(var(--muted-fg))]">No products</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-fg))]">
        <div>
          Page {data.page} / {data.totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={data.page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 disabled:opacity-60"
          >
            Prev
          </button>
          <button
            disabled={data.page >= data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages || 1, p + 1))}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
