import { useEffect, useMemo, useState } from 'react'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'
import { uploadImages } from '../../utils/uploadImage'

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
    buyLink: initial?.buyLink || '',
    stock: initial?.stock ?? 0,
    sku: initial?.sku || '',
    shippingCost: initial?.shippingCost ?? 0,
    status: initial?.status || 'DRAFT',
    tagsText: (initial?.tags || []).join(', '),
  }))

  const [existingImages, setExistingImages] = useState(() => initial?.images || [])
  const [newFiles, setNewFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ phase: '', pct: 0 })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues({
      title: initial?.title || '',
      description: initial?.description || '',
      category: initial?.category || CATEGORIES[0],
      price: initial?.price ?? '',
      originalPrice: initial?.originalPrice ?? '',
      buyLink: initial?.buyLink || '',
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

  async function compressImageFile(file) {
    try {
      const maxDim = 1000
      const mime = file.type || ''
      if (!mime.startsWith('image/')) return file

      if (file.size <= 300 * 1024) return file

      const bitmap = await createImageBitmap(file)
      if (bitmap.width <= maxDim && bitmap.height <= maxDim && file.size <= 750 * 1024) return file

      const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
      const w = Math.max(1, Math.round(bitmap.width * scale))
      const h = Math.max(1, Math.round(bitmap.height * scale))

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return file
      ctx.drawImage(bitmap, 0, 0, w, h)

      const outType = 'image/webp'
      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), outType, 0.72)
      })
      if (!blob) return file

      const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
      return new File([blob], name, { type: outType })
    } catch {
      return file
    }
  }

  async function uploadImagesIfNeeded() {
    if (!newFiles.length) return []

    setProgress({ phase: 'Preparing images…', pct: 8 })
    const prepared = await Promise.all(newFiles.map((f) => compressImageFile(f)))
    setProgress({ phase: 'Uploading images…', pct: 20 })

    try {
      const urls = await uploadImages(prepared, {
        limit: 5,
        onProgress: ({ index, total }) => {
          const ratio = total ? Math.min(1, Math.max(0, index / total)) : 0
          const pct = 20 + Math.round(ratio * 60)
          setProgress((p) => (p.pct >= pct ? p : { phase: 'Uploading images…', pct }))
        },
      })

      setProgress({ phase: 'Upload complete', pct: 82 })
      return urls.map((url) => ({ url, publicId: url }))
    } catch (e) {
      setProgress({ phase: 'Upload failed', pct: 0 })
      throw e
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      push('Please fix the form errors')
      return
    }

    const totalImages = (existingImages?.length || 0) + (newFiles?.length || 0)
    if (totalImages > 5) {
      push('Maximum 5 images allowed')
      return
    }
    if (mode !== 'edit' && totalImages < 1) {
      push('Please select at least 1 image')
      return
    }

    try {
      setBusy(true)
      setProgress({ phase: 'Starting…', pct: 2 })
      const uploaded = await uploadImagesIfNeeded()

      setProgress({ phase: mode === 'edit' ? 'Updating product…' : 'Creating product…', pct: 90 })
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        price: Number(values.price),
        originalPrice: values.originalPrice === '' ? 0 : Number(values.originalPrice),
        buyLink: values.buyLink.trim(),
        stock: Number(values.stock),
        sku: values.sku.trim(),
        shippingCost: Number(values.shippingCost),
        status: values.status,
        tags: normalizeTags(values.tagsText),
        images: [...existingImages, ...uploaded],
      }

      if (mode === 'edit') {
        const res = await api.put(`/api/products/${initial._id}`, payload)
        setProgress({ phase: 'Done', pct: 100 })
        push('Product updated')
        onSuccess?.(res.data.item)
        return
      }

      const res = await api.post('/api/products', payload)
      setProgress({ phase: 'Done', pct: 100 })
      push('Product created')
      onSuccess?.(res.data.item)
    } catch (err) {
      const status = err?.response?.status
      const backendMsg = err?.response?.data?.message
      const msg = backendMsg || err?.message || 'Failed to save product'
      // eslint-disable-next-line no-console
      console.error('Product save failed', {
        status,
        message: msg,
        data: err?.response?.data,
      })
      push(status ? `${msg} (HTTP ${status})` : msg)
    } finally {
      setBusy(false)
      setTimeout(() => setProgress({ phase: '', pct: 0 }), 700)
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
          <div className="text-sm font-medium text-[hsl(var(--fg))]">Affiliate Link</div>
          <input
            value={values.buyLink}
            onChange={(e) => setValues((v) => ({ ...v, buyLink: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none placeholder:text-[hsl(var(--muted-fg))] focus:border-black/20 dark:focus:border-white/20"
            placeholder="https://..."
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
            <div className="text-xs text-[hsl(var(--muted-fg))]">Upload up to 5 images. You can preview before upload.</div>
          </div>

          <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10 sm:w-auto">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                const remaining = Math.max(0, 5 - (existingImages?.length || 0))
                if (remaining <= 0) {
                  push('Maximum 5 images already selected')
                  setNewFiles([])
                  return
                }
                setNewFiles(files.slice(0, remaining))
              }}
            />
            Choose files
          </label>
        </div>

        {existingImages.length || previews.length ? (
          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {existingImages.map((img) => (
              <div key={img.publicId} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2">
                <div className="aspect-4/3 overflow-hidden rounded-lg">
                  <img src={img.url} alt="" className="h-full w-full max-w-full object-cover" />
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
                  <img src={p.url} alt={p.name} className="h-full w-full max-w-full object-cover" />
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
        {busy ? (
          <div className="w-full sm:mr-auto sm:max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs text-[hsl(var(--muted-fg))]">
              <div className="truncate pr-2">{progress.phase || 'Working…'}</div>
              <div className="tabular-nums">{Math.min(100, Math.max(0, progress.pct))}%</div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div
                className="h-full rounded-full bg-[hsl(var(--fg))] transition-[width] duration-200 ease-out"
                style={{ width: `${Math.min(100, Math.max(2, progress.pct || 2))}%` }}
              />
            </div>
          </div>
        ) : null}

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
