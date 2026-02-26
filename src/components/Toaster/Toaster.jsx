import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const ToastStateContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function push(message) {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((t) => [...t, { id, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2600)
  }

  const value = useMemo(() => ({ push }), [])

  return (
    <ToastContext.Provider value={value}>
      <ToastStateContext.Provider value={toasts}>
        {children}
        <Toaster />
      </ToastStateContext.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function Toaster() {
  const toasts = useContext(ToastStateContext) || []

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
