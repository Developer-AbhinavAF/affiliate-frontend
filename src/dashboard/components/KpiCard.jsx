export function KpiCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
      {sub ? <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{sub}</div> : null}
    </div>
  )
}
