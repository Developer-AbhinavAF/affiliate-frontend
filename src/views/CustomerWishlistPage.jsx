import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../state/auth'
import { ProductCard } from '../ui/ProductCard'

export function CustomerWishlistPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const storageKey = useMemo(() => {
    if (!user) return null
    const id = user.id || user._id || user.email || user.username || 'guest'
    return `wishlist_${id}`
  }, [user])

  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : []
      setItems(Array.isArray(parsed) ? parsed : [])
    } catch {
      setItems([])
    }
  }, [storageKey])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Wishlist</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ProductCard key={item.product._id} product={item.product} />
        ))}
        {items.length === 0 ? <div className="text-sm text-zinc-600 dark:text-zinc-400">No items</div> : null}
      </div>
    </div>
  )
}
