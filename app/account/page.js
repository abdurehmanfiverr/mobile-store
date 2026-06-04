import { getCurrentUser } from "../lib/session";
import { getOrdersByEmail } from "../lib/orders";
import { formatPrice } from "../products-data";
import { signup, login, logout } from "./actions";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default async function AccountPage({ searchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;

  // --- Logged out: show login + sign-up ---
  if (!user) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold text-zinc-900">My Account</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Log in */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-zinc-900">Log in</h3>
            <form action={login} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                Email
                <input type="email" name="email" required className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Password
                <input type="password" name="password" required className={inputClass} />
              </label>
              {params?.error === "login" && (
                <p className="text-sm font-medium text-red-600">
                  Wrong email or password.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Log in
              </button>
            </form>
          </div>

          {/* Sign up */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-zinc-900">
              Create an account
            </h3>
            <form action={signup} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                Full name
                <input type="text" name="name" required className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Email
                <input type="email" name="email" required className={inputClass} />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Password (at least 6 characters)
                <input type="password" name="password" required minLength={6} className={inputClass} />
              </label>
              {params?.error === "signup" && (
                <p className="text-sm font-medium text-red-600">
                  Please fill all fields; password must be 6+ characters.
                </p>
              )}
              {params?.error === "exists" && (
                <p className="text-sm font-medium text-red-600">
                  An account with that email already exists.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // --- Logged in: account info + order history ---
  const orders = await getOrdersByEmail(user.email);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">My Account</h2>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            Log out
          </button>
        </form>
      </div>
      <p className="mt-2 text-zinc-600">
        Hello, <span className="font-semibold">{user.name}</span> ({user.email})
      </p>

      <h3 className="mb-4 mt-10 text-lg font-semibold text-zinc-900">
        Your orders
      </h3>
      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
          You haven&apos;t placed any orders yet.
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
                {new Date(order.createdAt).toLocaleString()}
              </p>
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
