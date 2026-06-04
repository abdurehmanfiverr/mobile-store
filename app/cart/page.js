"use client";

import Link from "next/link";
import { useCart } from "../CartContext";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "../products-data";
import ProductImage from "../ProductImage";

export default function CartPage() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    totalPrice,
  } = useCart();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <h2 className="mb-6 text-3xl font-bold text-zinc-900">Your Cart</h2>

      {cart.length === 0 ? (
        // Friendly message when nothing has been added yet.
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-zinc-500">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm font-medium text-zinc-700 underline hover:text-zinc-900"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {/* One row per item in the cart */}
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0"
            >
              {/* Thumbnail, name, and unit price */}
              <div className="flex min-w-32 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-1">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    imgClassName="h-full w-full object-contain"
                    fallback={<span className="text-lg">📷</span>}
                  />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{item.name}</p>
                  <p className="text-sm text-zinc-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>

              {/* Quantity controls: minus, the number, plus */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(item.name)}
                  aria-label={`Decrease ${item.name} quantity`}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-lg text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium text-zinc-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  aria-label={`Increase ${item.name} quantity`}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-lg text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  +
                </button>
              </div>

              {/* Line total and a Remove button */}
              <div className="flex items-center gap-4">
                <p className="w-24 text-right font-semibold text-zinc-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.name)}
                  className="text-sm font-medium text-rose-600 transition-colors hover:text-rose-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Price breakdown: subtotal, delivery, then the final total */}
          <div className="space-y-2 bg-zinc-50 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-zinc-400">
                Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for
                free delivery.
              </p>
            )}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Clear cart + Checkout */}
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
            >
              Clear cart
            </button>
            <Link
              href="/checkout"
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Checkout ({formatPrice(totalPrice)})
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
