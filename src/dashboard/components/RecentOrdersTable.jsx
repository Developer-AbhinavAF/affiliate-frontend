export function RecentOrdersTable({ orders }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="text-[hsl(var(--muted-fg))]">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {(orders || []).map((o) => (
            <tr key={o._id} className="border-t border-[hsl(var(--border))]">
              <td className="px-4 py-3 font-medium text-[hsl(var(--fg))]">{String(o._id).slice(-8)}</td>
              <td className="px-4 py-3 text-[hsl(var(--fg))]">{o.status}</td>
              <td className="px-4 py-3 text-[hsl(var(--fg))]">₹ {Math.round(o.grandTotal).toLocaleString()}</td>
              <td className="px-4 py-3 text-[hsl(var(--muted-fg))]">{o.paymentMethod}</td>
              <td className="px-4 py-3 text-[hsl(var(--muted-fg))]">{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {(orders || []).length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-[hsl(var(--muted-fg))]">
                No orders
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
