export function RecentOrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="text-zinc-600 dark:text-zinc-400">
          <tr>
            <th className="py-2">Order</th>
            <th className="py-2">Status</th>
            <th className="py-2">Total</th>
            <th className="py-2">Payment</th>
            <th className="py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {(orders || []).map((o) => (
            <tr key={o._id} className="border-t border-zinc-200/70 dark:border-zinc-800">
              <td className="py-2 text-zinc-900 dark:text-zinc-100">{String(o._id).slice(-8)}</td>
              <td className="py-2 text-zinc-900 dark:text-zinc-100">{o.status}</td>
              <td className="py-2 text-zinc-900 dark:text-zinc-100">₹ {Math.round(o.grandTotal).toLocaleString()}</td>
              <td className="py-2 text-zinc-600 dark:text-zinc-400">{o.paymentMethod}</td>
              <td className="py-2 text-zinc-600 dark:text-zinc-400">{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {(orders || []).length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                No orders
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
