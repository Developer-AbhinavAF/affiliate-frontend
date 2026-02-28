import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

export function AdminManageProductsPage() {
  const qc = useQueryClient()
  const { push } = useToast()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'manage-products', q, status, page],
    queryFn: async () => {
      const res = await api.get('/api/products/manage/all', {
        params: { q: q || undefined, status: status || undefined, page },
      })
      return res.data
    },
  })

  const del = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/products/${id}`)
    },
    onSuccess: async () => {
      push('Product deleted')
      await qc.invalidateQueries({ queryKey: ['admin', 'manage-products'] })
    },
    onError: () => push('Failed to delete product'),
  })

  const rows = useMemo(() => data?.items || [], [data])

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load products</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Manage Products</div>
          <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Search, edit, delete and manage statuses.</div>
        </div>
        <Link
          to="/admin/products/new"
          className="w-full rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-center text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90 sm:w-auto"
        >
          Add Product
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search by title"
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
        />
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

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {rows.map((p) => (
          <div key={p._id} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[hsl(var(--fg))]">{p.title}</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-fg))]">{p.category}</div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-[hsl(var(--fg))]">₹ {Math.round(p.price).toLocaleString()}</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-[hsl(var(--muted-fg))]">
                Stock: <span className="text-[hsl(var(--fg))]">{p.stock}</span>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-[hsl(var(--muted-fg))]">
                Status: <span className="text-[hsl(var(--fg))]">{p.status}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to={`/admin/products/${p._id}/edit`}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-center text-sm text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
              >
                Edit
              </Link>
              <button
                disabled={del.isPending}
                onClick={() => del.mutate(p._id)}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--fg))] hover:bg-black/5 disabled:opacity-60 dark:hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 ? <div className="text-sm text-[hsl(var(--muted-fg))]">No products</div> : null}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 backdrop-blur sm:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-[hsl(var(--muted-fg))]">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Created By</th>
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
                <td className="py-2 text-[hsl(var(--muted-fg))]">{p.createdBy?.name || ''}</td>
                <td className="py-2 text-[hsl(var(--fg))]">₹ {Math.round(p.price).toLocaleString()}</td>
                <td className="py-2 text-[hsl(var(--fg))]">{p.stock}</td>
                <td className="py-2 text-[hsl(var(--fg))]">{p.status}</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/products/${p._id}/edit`}
                      className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={del.isPending}
                      onClick={() => del.mutate(p._id)}
                      className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-[hsl(var(--fg))] hover:bg-black/5 disabled:opacity-60 dark:hover:bg-white/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-[hsl(var(--muted-fg))]">
                  No products
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
