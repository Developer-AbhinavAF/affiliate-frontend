export function KpiCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-white/60">{sub}</div> : null}
    </div>
  )
}
