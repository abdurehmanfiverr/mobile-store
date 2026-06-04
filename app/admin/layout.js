import { cookies } from "next/headers";
import Link from "next/link";
import { adminLogin, adminLogout } from "./products/actions";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === PASSWORD;

  // Login gate for the whole /admin area.
  if (!authed) {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <h2 className="text-2xl font-bold text-zinc-900">Admin login</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your password to manage the store.
        </p>
        <form action={adminLogin} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  const linkClass =
    "block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="md:w-52 md:shrink-0">
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Admin
          </p>
          <nav className="space-y-1">
            <Link href="/admin" className={linkClass}>Overview</Link>
            <Link href="/admin/orders" className={linkClass}>Orders</Link>
            <Link href="/admin/products" className={linkClass}>Products</Link>
            <Link href="/admin/messages" className={linkClass}>Messages</Link>
          </nav>
          <form action={adminLogout} className="mt-2 border-t border-zinc-100 pt-2">
            <button
              type="submit"
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
