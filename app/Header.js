"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  // Read the total item count from the shared cart box.
  const { totalItems } = useCart();

  return (
    // sticky top-0 keeps the bar visible as you scroll; blue gives it color.
    <header className="sticky top-0 z-50 w-full bg-blue-500 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo on the left — clicking it goes Home */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <span className="text-2xl">📱</span>
          <span>
            Shehroz Mobiles
            <span className="hidden sm:inline"> and Accessories</span>
          </span>
        </Link>

        {/* Navigation links + cart on the right */}
        <nav className="flex items-center gap-6 text-sm font-medium text-blue-100">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/products" className="transition-colors hover:text-white">
            Products
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            Cart
            {/* Amber badge pops against the blue bar; shows only when filled */}
            {totalItems > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-bold text-zinc-900">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
