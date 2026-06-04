"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "../products-data";
import { logout } from "./actions";
import ProfileForm from "./ProfileForm";

export default function Dashboard({ profile, orders, justVerified }) {
  const [tab, setTab] = useState("orders");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">
            Welcome, {profile.name}! 👋
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{profile.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Log out
          </button>
        </form>
      </div>

      {justVerified && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✅ Your email is verified and you&apos;re logged in. Welcome!
        </p>
      )}

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-zinc-200">
        {[
          { key: "orders", label: "My Orders" },
          { key: "profile", label: "My Profile" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "orders" ? (
          orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <p className="text-zinc-500">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-zinc-200 bg-white p-5">
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
                      <div key={item.name} className="flex justify-between text-zinc-600">
                        <span>{item.name} × {item.quantity}</span>
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
          )
        ) : (
          <ProfileForm profile={profile} />
        )}
      </div>
    </main>
  );
}
