import { useEffect, useMemo, useState } from 'react'

import { uploadImages } from '../utils/uploadImage'

function formatBytes(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`
  return `${(v / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminAddProduct() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  })

  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ index: 0, total: 0 })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const previews = useMemo(() => {
    return selectedFiles.map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
    }))
  }, [selectedFiles])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  async function handleUpload() {
    setError('')
    setSuccess('')

    try {
      if (!selectedFiles.length) {
        setError('Please select up to 5 images')
        return
      }
      if (selectedFiles.length > 5) {
        setError('Maximum 5 images allowed')
        return
      }

      setUploading(true)
      setProgress({ index: 0, total: selectedFiles.length })

      const urls = await uploadImages(selectedFiles, {
        limit: 5,
        onProgress: ({ index, total }) => setProgress({ index, total }),
      })

      setProduct((p) => ({ ...p, images: urls }))
      setSuccess('Images uploaded successfully')
    } catch (e) {
      setError(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const next = {
        ...product,
        title: product.title.trim(),
        description: product.description.trim(),
        price: Number(product.price),
      }

      if (!next.title) {
        setError('Title is required')
        return
      }
      if (!next.description) {
        setError('Description is required')
        return
      }
      if (!Number.isFinite(next.price) || next.price < 0) {
        setError('Price must be a valid number')
        return
      }
      if (!Array.isArray(next.images) || !next.images.length) {
        setError('Please upload at least 1 image')
        return
      }

      console.log('FINAL PRODUCT OBJECT:', next)
      setSuccess('Product ready (check console).')
    } catch (e) {
      setError(e?.message || 'Failed to submit')
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-6">
        <div className="text-xl font-semibold text-[hsl(var(--fg))]">Admin: Add Product</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Upload images to ImgBB and store URLs in the product object.</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-[hsl(var(--fg))]">Title</div>
            <input
              value={product.title}
              onChange={(e) => setProduct((p) => ({ ...p, title: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
              placeholder="Product title"
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-sm font-medium text-[hsl(var(--fg))]">Description</div>
            <textarea
              rows={5}
              value={product.description}
              onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))}
              className="mt-2 w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
              placeholder="Product description"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-[hsl(var(--fg))]">Price</div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={(e) => setProduct((p) => ({ ...p, price: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:border-black/20 dark:focus:border-white/20"
              placeholder="0.00"
            />
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4 backdrop-blur md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-[hsl(var(--fg))]">Images</div>
                <div className="text-xs text-[hsl(var(--muted-fg))]">Select up to 5 images. Preview before upload.</div>
              </div>

              <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--fg))] transition hover:bg-black/5 dark:hover:bg-white/10 sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setSelectedFiles(files.slice(0, 5))
                    setSuccess('')
                    setError('')
                    setProgress({ index: 0, total: 0 })
                  }}
                />
                Choose files
              </label>
            </div>

            {previews.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {previews.map((p) => (
                  <div
                    key={p.url}
                    className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-xs text-[hsl(var(--muted-fg))]">{p.name}</div>
                      <div className="text-xs text-[hsl(var(--muted-fg))]">{formatBytes(p.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm text-[hsl(var(--muted-fg))]">No images selected</div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-[hsl(var(--muted-fg))]">
                {uploading ? (
                  <div>
                    Uploading {Math.min(progress.index + 1, progress.total)}/{progress.total}
                  </div>
                ) : product.images.length ? (
                  <div>Uploaded: {product.images.length} image URL(s)</div>
                ) : (
                  <div />
                )}
              </div>

              <button
                type="button"
                disabled={uploading || !selectedFiles.length}
                onClick={handleUpload}
                className="w-full rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {uploading ? 'Uploading…' : 'Upload to ImgBB'}
              </button>
            </div>

            {error ? <div className="mt-3 text-sm text-red-500">{error}</div> : null}
            {success ? <div className="mt-3 text-sm text-green-600">{success}</div> : null}

            {product.images.length ? (
              <div className="mt-4">
                <div className="mb-2 text-sm font-medium text-[hsl(var(--fg))]">Uploaded Thumbnails</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {product.images.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img src={url} alt="Uploaded" className="h-full w-full object-cover" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-[hsl(var(--fg))] px-4 py-3 text-sm font-medium text-[hsl(var(--bg))] transition hover:opacity-90 sm:w-auto"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  )
}
