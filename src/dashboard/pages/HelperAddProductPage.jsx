import { useNavigate } from 'react-router-dom'

import { ProductForm } from '../components/ProductForm'

export function HelperAddProductPage() {
  const nav = useNavigate()

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5 shadow-sm backdrop-blur">
      <div className="mb-4">
        <div className="text-sm font-medium text-[hsl(var(--fg))]">Add New Product</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">
          Submit a product. It will be sent for admin approval.
        </div>
      </div>

      <ProductForm
        mode="create"
        onCancel={() => nav(-1)}
        onSuccess={(item) => nav(`/helper/products/${item._id}/edit`)}
      />
    </div>
  )
}
