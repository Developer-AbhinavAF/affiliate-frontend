import { useEffect, useMemo, useState } from 'react'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const CATEGORIES = ['electrical', 'supplements', 'clothes_men', 'clothes_women', 'clothes_kids']

function normalizeTags(input) {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
}

function validate(values) {
  const errors = {}
  if (!values.title || values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters'
  if (!values.description || values.description.trim().length < 10) errors.description = 'Description must be at least 10 characters'
  if (!values.category) errors.category = 'Category is required'
  if (values.price === '' || Number(values.price) < 0) errors.price = 'Price must be 0 or more'
  if (values.originalPrice !== '' && Number(values.originalPrice) < 0) errors.originalPrice = 'Discount price must be 0 or more'
  if (values.stock === '' || Number(values.stock) < 0) errors.stock = 'Stock must be 0 or more'
  if (values.shippingCost !== '' && Number(values.shippingCost) < 0) errors.shippingCost = 'Shipping cost must be 0 or more'
  return errors
}

export function ProductForm({
  mode,
  initial,
  onCancel,
  onSuccess,
  uploadEndpoint = '/api/uploads/product-images',
}) {
  const { push } = useToast()

  const [values, setValues] = useState(() => ({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || CATEGORIES[0],
    price: initial?.price ?? '',
    originalPrice: initial?.originalPrice ?? '',
    stock: initial?.stock ?? 0,
    sku: initial?.sku || '',
    shippingCost: initial?.shippingCost ?? 0,
    status: initial?.status || 'DRAFT',
    tagsText: (initial?.tags || []).join(', '),
  }))

  const [existingImages, setExistingImages] = useState(() => initial?.images || [])
  const [newFiles, setNewFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues({
      title: initial?.title || '',
      description: initial?.description || '',
      category: initial?.category || CATEGORIES[0],
      price: initial?.price ?? '',
      originalPrice: initial?.originalPrice ?? '',
      stock: initial?.stock ?? 0,
      sku: initial?.sku || '',
      shippingCost: initial?.shippingCost ?? 0,
      status: initial?.status || 'DRAFT',
      tagsText: (initial?.tags || []).join(', '),
    })
    setExistingImages(initial?.images || [])
    setNewFiles([])
    setErrors({})
  }, [initial])

  const previews = useMemo(() => {
    return newFiles.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
    }))
  }, [newFiles])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  async function uploadImagesIfNeeded() {
    if (!newFiles.length) return []

    const fd = new FormData()
    newFiles.forEach((f) => fd.append('images', f))

    const res = await api.post(uploadEndpoint, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return res.data.images || []
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      push('Please fix the form errors')
      return
    }

    try {
      setBusy(true)
      const uploaded = await uploadImagesIfNeeded()

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        price: Number(values.price),
        originalPrice: values.originalPrice === '' ? 0 : Number(values.originalPrice),
        stock: Number(values.stock),
        sku: values.sku.trim(),
        shippingCost: Number(values.shippingCost),
        status: values.status,
        tags: normalizeTags(values.tagsText),
        images: [...existingImages, ...uploaded],
      }

      if (mode === 'edit') {
        const res = await api.put(`/api/products/${initial._id}`, payload)
        push('Product updated')
        onSuccess?.(res.data.item)
        return
      }

      const res = await api.post('/api/products', payload)
      push('Product created')
      onSuccess?.(res.data.item)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save product'
      push(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Title</div>
          <input
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            placeholder="Product title"
          />
          {errors.title ? <div className="mt-1 text-xs text-red-500">{errors.title}</div> : null}
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Category</div>
          <select
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category ? <div className="mt-1 text-xs text-red-500">{errors.category}</div> : null}
        </div>

        <div className="lg:col-span-2">
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Description</div>
          <textarea
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            rows={6}
            className="mt-2 w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            placeholder="Write a detailed description"
          />
          {errors.description ? <div className="mt-1 text-xs text-red-500">{errors.description}</div> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Price</div>
          <input
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          />
          {errors.price ? <div className="mt-1 text-xs text-red-500">{errors.price}</div> : null}
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Discount Price</div>
          <input
            value={values.originalPrice}
            onChange={(e) => setValues((v) => ({ ...v, originalPrice: e.target.value }))}
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          />
          {errors.originalPrice ? <div className="mt-1 text-xs text-red-500">{errors.originalPrice}</div> : null}
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Stock</div>
          <input
            value={values.stock}
            onChange={(e) => setValues((v) => ({ ...v, stock: e.target.value }))}
            type="number"
            min="0"
            step="1"
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          />
          {errors.stock ? <div className="mt-1 text-xs text-red-500">{errors.stock}</div> : null}
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Shipping Cost</div>
          <input
            value={values.shippingCost}
            onChange={(e) => setValues((v) => ({ ...v, shippingCost: e.target.value }))}
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          />
          {errors.shippingCost ? <div className="mt-1 text-xs text-red-500">{errors.shippingCost}</div> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">SKU</div>
          <input
            value={values.sku}
            onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            placeholder="SKU"
          />
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Status</div>
          <select
            value={values.status}
            onChange={(e) => setValues((v) => ({ ...v, status: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="APPROVED">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Tags</div>
          <input
            value={values.tagsText}
            onChange={(e) => setValues((v) => ({ ...v, tagsText: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--fg))]">Images</div>
            <div className="text-xs text-[hsl(var(--muted-fg))]">Upload up to 8 images. You can preview before upload.</div>
          </div>

          <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10 sm:w-auto">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setNewFiles(files.slice(0, 8))
              }}
            />
            Choose files
          </label>
        </div>

        {existingImages.length || previews.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {existingImages.map((img) => (
              <div key={img.publicId} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2">
                <div className="aspect-4/3 overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setExistingImages((arr) => arr.filter((x) => x.publicId !== img.publicId))}
                  className="mt-2 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs text-[hsl(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            ))}

            {previews.map((p) => (
              <div key={p.url} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2">
                <div className="aspect-4/3 overflow-hidden rounded-lg">
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-2 truncate text-xs text-[hsl(var(--muted-fg))]">{p.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-[hsl(var(--muted-fg))]">No images selected</div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10 sm:w-auto"
          >
            Cancel
          </button>
        ) : null}

        <button
          disabled={busy}
          type="submit"
          className="w-full rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {busy ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
