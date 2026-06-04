"use client";

import { useState } from "react";
import { useCart } from "../CartContext";

// Add to Cart button used on the product detail page. Briefly shows a
// confirmation after clicking.
export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-base font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
    >
      {added ? "✓ Added to cart" : "Add to Cart"}
    </button>
  );
}
