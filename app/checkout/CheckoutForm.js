"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../CartContext";
import { formatPrice } from "../products-data";
import { getCoupon, couponDiscount } from "../lib/coupons";
import { placeOrder } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutForm({ initial }) {
  const { cart, subtotal, deliveryFee, clearCart } = useCart();

  const [form, setForm] = useState({
    name: initial?.name || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    address: initial?.address || "",
    city: initial?.city || "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [placed, setPlaced] = useState(null);
  const [formError, setFormError] = useState("");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const discount = applied ? couponDiscount(applied, subtotal) : 0;
  const finalTotal = Math.max(0, subtotal - discount) + deliveryFee;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  }

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

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!form.phone.trim()) e.phone = "Please enter your phone number.";
    if (!emailRe.test(form.email.trim())) e.email = "Please enter a valid email.";
    if (!form.address.trim()) e.address = "Please enter your delivery address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setStatus("submitting");

    const itemsSnapshot = cart.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    const res = await placeOrder({
      customer: form,
      items: itemsSnapshot,
      subtotal,
      deliveryFee,
      couponCode: applied?.code || null,
    });

    if (res.ok) {
      setPlaced({
        id: res.orderId,
        items: itemsSnapshot,
        subtotal,
        deliveryFee,
        discount,
        total: finalTotal,
        coupon: applied?.code || null,
        customer: { ...form },
      });
      setStatus("done");
      clearCart();
    } else {
      setFormError(res.error || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  function Field({ label, name, type = "text", placeholder, optional }) {
    return (
      <label className="block text-sm font-medium text-zinc-700">
        {label} {optional && <span className="text-zinc-400">(optional)</span>}
        <input
          type={type}
          value={form[name]}
          onChange={(ev) => update(name, ev.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        {errors[name] && (
          <span className="mt-1 block text-xs font-medium text-red-600">
            {errors[name]}
          </span>
        )}
      </label>
    );
  }

  // ---------- Confirmation ----------
  if (status === "done" && placed) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✅
          </div>
          <h2 className="mt-4 text-2xl font-bold text-zinc-900">
            Thank you for your order!
          </h2>
          <p className="mt-2 text-zinc-600">
            Your order number is <span className="font-bold">{placed.id}</span>.
            We&apos;ll contact you on your phone to confirm — payment is Cash on
            Delivery.
          </p>

          <div className="mt-6 rounded-xl border border-zinc-200 p-5 text-left text-sm">
            {placed.items.map((item) => (
              <div key={item.name} className="flex justify-between text-zinc-600">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            {placed.discount > 0 && (
              <div className="mt-1 flex justify-between text-emerald-600">
                <span>Discount{placed.coupon ? ` (${placed.coupon})` : ""}</span>
                <span>− {formatPrice(placed.discount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 font-bold text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(placed.total)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 p-5 text-left text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Delivering to</p>
            <p className="mt-1">{placed.customer.name}</p>
            <p>{placed.customer.phone}</p>
            <p>
              {placed.customer.address}
              {placed.customer.city ? `, ${placed.customer.city}` : ""}
            </p>
          </div>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  // ---------- Empty cart ----------
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

  // ---------- Checkout (two columns) ----------
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h2 className="mb-8 text-3xl font-bold text-zinc-900">Checkout</h2>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
        {/* LEFT: delivery details + payment */}
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">
              Delivery details
            </h3>
            <div className="space-y-4">
              <Field label="Full name" name="name" placeholder="Your name" />
              <Field label="Phone number" name="phone" type="tel" placeholder="03xx-xxxxxxx" />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" />
              <label className="block text-sm font-medium text-zinc-700">
                Delivery address
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="House #, street, area"
                  className={inputClass}
                />
                {errors.address && (
                  <span className="mt-1 block text-xs font-medium text-red-600">
                    {errors.address}
                  </span>
                )}
              </label>
              <Field label="City" name="city" placeholder="City" optional />
              <label className="block text-sm font-medium text-zinc-700">
                Order note <span className="text-zinc-400">(optional)</span>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="Any delivery instructions?"
                  className={inputClass}
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">
              Payment method
            </h3>
            <div className="flex items-center gap-3 rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Cash on Delivery
                </p>
                <p className="text-xs text-zinc-500">Pay when your order arrives.</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-200 p-4 opacity-60">
              <span className="h-5 w-5 rounded-full border-2 border-zinc-300" />
              <div>
                <p className="text-sm font-medium text-zinc-700">Card payment</p>
                <p className="text-xs text-zinc-400">Coming soon.</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: order summary */}
        <div className="h-fit rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900">
            Order summary
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">
                  {item.name} <span className="text-zinc-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <label className="text-sm font-medium text-zinc-700">Coupon code</label>
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

          {/* Totals */}
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

          {formError && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
          >
            {status === "submitting"
              ? "Placing order…"
              : `Place Order — ${formatPrice(finalTotal)}`}
          </button>
          <p className="mt-2 text-center text-xs text-zinc-500">
            Payment: Cash on Delivery
          </p>
        </div>
      </form>
    </main>
  );
}
