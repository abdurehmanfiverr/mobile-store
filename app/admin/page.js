import Link from "next/link";
import { getOrders } from "../lib/orders";
import { getProducts } from "../lib/products-store";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const orders = await getOrders();
  const products = await getProducts();
  const pending = orders.filter(
    (o) => (o.status || "Pending") === "Pending"
  ).length;

  const stats = [
    { label: "Total Orders", value: orders.length, href: "/admin/orders" },
    { label: "Pending Orders", value: pending, href: "/admin/orders" },
    { label: "Total Products", value: products.length, href: "/admin/products" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900">Overview</h2>
      <p className="mt-1 text-sm text-zinc-500">A quick look at your store.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-zinc-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/orders"
          className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          View orders
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          Manage products
        </Link>
      </div>
    </div>
  );
}
