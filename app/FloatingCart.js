"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

// A floating cart button that appears in the bottom-right corner once the
// cart has items. It links to the cart page and shows the item count.
export default function FloatingCart() {
  const { totalItems } = useCart();

  // Nothing in the cart yet → don't show anything.
  if (totalItems === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label={`View cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="animate-pop-in fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg transition-transform hover:scale-105"
    >
      {/* Shopping cart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>

      {/* Item count badge */}
      <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700 ring-2 ring-blue-100">
        {totalItems}
      </span>
    </Link>
  );
}
