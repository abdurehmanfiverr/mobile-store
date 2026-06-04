import { getOrders } from "../../lib/orders";
import { formatPrice } from "../../products-data";
import { setStatus } from "../../orders/actions";

export const dynamic = "force-dynamic";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900">Orders</h2>
      <p className="mt-1 text-sm text-zinc-500">{orders.length} total</p>

      {orders.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
          No orders yet.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-zinc-100 last:border-b-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{o.id}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {o.customer?.name}
                    <span className="block text-xs text-zinc-400">
                      {o.customer?.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <form action={setStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status || "Pending"}
                        className="rounded-md border border-zinc-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
