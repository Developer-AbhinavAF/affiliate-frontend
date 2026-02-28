import { useNavigate } from 'react-router-dom'

import { ProductForm } from '../components/ProductForm'

export function SuperAdminAddProductPage() {
  const nav = useNavigate()

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur">
      <div className="mb-4">
        <div className="text-sm font-medium text-[hsl(var(--fg))]">Add New Product</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Create a product and upload multiple images.</div>
      </div>

      <ProductForm
        mode="create"
        onCancel={() => nav(-1)}
        onSuccess={(item) => nav(`/superadmin/products/${item._id}/edit`)}
      />
    </div>
  )
}
