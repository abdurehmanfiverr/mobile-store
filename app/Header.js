"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import Logo from "./Logo";

export default function Header() {
  // Read the total item count from the shared cart box.
  const { totalItems } = useCart();

  return (
    // sticky top-0 keeps the bar visible as you scroll; blue gives it color.
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo on the left — clicking it goes Home */}
        <Link href="/" className="flex items-center text-white">
          <Logo />
        </Link>

        {/* Navigation links + cart on the right */}
        <nav className="flex items-center gap-6 text-sm font-medium text-blue-100">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/products" className="transition-colors hover:text-white">
            Products
          </Link>
          <Link href="/account" className="transition-colors hover:text-white">
            Account
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            Cart
            {/* White badge pops against the blue bar; shows only when filled */}
            {totalItems > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
