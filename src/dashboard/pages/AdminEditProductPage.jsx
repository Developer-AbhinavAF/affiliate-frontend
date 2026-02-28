import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { api } from '../../lib/api'
import { ProductForm } from '../components/ProductForm'

export function AdminEditProductPage() {
  const { id } = useParams()
  const nav = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}/manage`)
      return res.data.item
    },
  })

  if (isLoading) return <div className="text-sm text-[hsl(var(--muted-fg))]">Loading…</div>
  if (isError) return <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load product</div>

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur">
      <div className="mb-4">
        <div className="text-sm font-medium text-[hsl(var(--fg))]">Edit Product</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Update details, images, status and inventory.</div>
      </div>

      <ProductForm mode="edit" initial={data} onCancel={() => nav(-1)} onSuccess={() => nav('/admin/manage-products')} />
    </div>
  )
}
