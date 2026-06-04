"use client";

import { useState } from "react";
import { useCart } from "../CartContext";

// Quantity selector + Add to Cart button for the product detail page.
export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-zinc-300">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="px-4 py-2 text-lg text-zinc-600 hover:text-zinc-900"
        >
          −
        </button>
        <span className="w-8 text-center font-medium text-zinc-900">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="px-4 py-2 text-lg text-zinc-600 hover:text-zinc-900"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-base font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
      >
        {added ? "✓ Added to cart" : "Add to Cart"}
      </button>
    </div>
  );
}
