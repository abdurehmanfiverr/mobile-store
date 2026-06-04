"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../CartContext";
import { formatPrice } from "../products-data";
import { getCoupon, couponDiscount } from "../lib/coupons";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const { cart, subtotal, deliveryFee, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState(null); // { code, type, value, label }
  const [couponMsg, setCouponMsg] = useState("");

  const discount = applied ? couponDiscount(applied, subtotal) : 0;
  const finalTotal = Math.max(0, subtotal - discount) + deliveryFee;

  function applyCoupon() {
    const c = getCoupon(couponInput);
    if (c) {
      setApplied({ code: couponInput.trim().toUpperCase(), ...c });
      setCouponMsg("");
    } else {
      setApplied(null);
      setCouponMsg("That code isn't valid.");
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    const res = await placeOrder({
      customer: form,
      items: cart.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      deliveryFee,
      couponCode: applied?.code || null,
    });

    if (res.ok) {
      setOrderId(res.orderId);
      setStatus("done");
      clearCart();
    } else {
      setError(res.error || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  // --- After a successful order ---
  if (status === "done") {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10">
          <h2 className="text-2xl font-bold text-emerald-800">
            🎉 Order placed!
          </h2>
          <p className="mt-3 text-emerald-700">
            Thank you for your order. Your order number is{" "}
            <span className="font-bold">{orderId}</span>. We&apos;ll call you on
            the number you provided to confirm delivery — payment is Cash on
            Delivery.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  // --- Empty cart ---
  if (cart.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-zinc-900">Checkout</h2>
        <p className="mt-4 text-zinc-500">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-medium text-blue-600 underline hover:text-blue-800"
        >
          Browse products
        </Link>
      </main>
    );
  }

  // --- Checkout form + order summary ---
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h2 className="mb-8 text-3xl font-bold text-zinc-900">Checkout</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Delivery details form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            Delivery details
          </h3>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Full name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Phone number
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Delivery address
            </label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {status === "submitting"
              ? "Placing order…"
              : `Place Order — ${formatPrice(finalTotal)}`}
          </button>
          <p className="text-xs text-zinc-500">
            Payment method: Cash on Delivery.
          </p>
        </form>

        {/* Order summary */}
        <div className="h-fit rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900">
            Order summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-700">
                  {item.name}{" "}
                  <span className="text-zinc-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          {/* Coupon code */}
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <label className="text-sm font-medium text-zinc-700">
              Coupon code
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. SAVE10"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Apply
              </button>
            </div>
            {applied && (
              <p className="mt-2 text-sm font-medium text-emerald-600">
                {applied.code} applied ({applied.label}).{" "}
                <button
                  type="button"
                  onClick={() => {
                    setApplied(null);
                    setCouponInput("");
                  }}
                  className="text-zinc-500 underline"
                >
                  Remove
                </button>
              </p>
            )}
            {couponMsg && (
              <p className="mt-2 text-sm font-medium text-red-600">{couponMsg}</p>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount{applied ? ` (${applied.code})` : ""}</span>
                <span>− {formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
