import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../state/auth'
import { ProductCard } from '../ui/ProductCard'

export function CustomerCartPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const storageKey = useMemo(() => {
    if (!user) return null
    const id = user.id || user._id || user.email || user.username || 'guest'
    return `cart_${id}`
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

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0
  )
  const delivery = subtotal > 0 ? 0 : 0
  const grandTotal = subtotal + delivery

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      <div className="text-lg font-semibold text-zinc-50">My Cart</div>

      {items.length === 0 ? (
        <div className="text-sm text-zinc-400">Your cart is empty.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
                <ProductCard product={item.product} />
                <div className="mt-2 text-xs text-zinc-400">Quantity: {item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="text-sm font-semibold text-zinc-50">Price details</div>
            <div className="flex justify-between text-sm text-zinc-300">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-300">
              <span>Delivery</span>
              <span>{delivery ? `₹ ${delivery.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 text-sm font-semibold text-zinc-50">
              <span>Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

