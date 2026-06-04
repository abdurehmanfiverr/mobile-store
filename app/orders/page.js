import { cookies } from "next/headers";
import { getOrders } from "../lib/orders";
import { formatPrice } from "../products-data";
import { login, logout, setStatus } from "./actions";

// Always read the latest orders / auth state at request time.
export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const STATUSES = ["Pending", "Confirmed", "Delivered", "Cancelled"];

export default async function OrdersPage({ searchParams }) {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === PASSWORD;
  const params = await searchParams;

  // --- Not logged in: show the password form ---
  if (!authed) {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <h2 className="text-2xl font-bold text-zinc-900">Owner login</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your password to view orders.
        </p>
        <form action={login} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {params?.error && (
            <p className="text-sm font-medium text-red-600">
              Wrong password. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  // --- Logged in: show the orders ---
  const orders = await getOrders();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">Orders</h2>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            Log out
          </button>
        </form>
      </div>
      <p className="mb-8 text-sm text-zinc-500">
        {orders.length} order{orders.length === 1 ? "" : "s"} so far.
      </p>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
          No orders yet. When a customer checks out, their order appears here.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-zinc-900">{order.id}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {order.status || "Pending"}
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                {new Date(order.createdAt).toLocaleString()} · {order.payment}
              </p>

              {/* Customer */}
              <div className="mt-3 text-sm text-zinc-700">
                <p className="font-medium text-zinc-900">{order.customer.name}</p>
                <p>{order.customer.phone}</p>
                <p>
                  {order.customer.address}
                  {order.customer.city ? `, ${order.customer.city}` : ""}
                </p>
              </div>

              {/* Items */}
              <div className="mt-3 border-t border-zinc-100 pt-3 text-sm">
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between text-zinc-600"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount{order.coupon ? ` (${order.coupon})` : ""}</span>
                    <span>− {formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-zinc-100 pt-2 font-bold text-zinc-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Quick status buttons — the current status is highlighted */}
              <form
                action={setStatus}
                className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3"
              >
                <input type="hidden" name="id" value={order.id} />
                <span className="text-xs font-medium text-zinc-400">
                  Set status:
                </span>
                {STATUSES.map((s) => {
                  const active = (order.status || "Pending") === s;
                  return (
                    <button
                      key={s}
                      type="submit"
                      name="status"
                      value={s}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
