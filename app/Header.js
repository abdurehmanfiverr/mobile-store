"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import Logo from "./Logo";

// Small cart badge used in both the desktop nav and the mobile menu.
function CartBadge({ count }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700">
      {count}
    </span>
  );
}

export default function Header() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/account", label: "Account" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-white"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        {/* Desktop navigation (hidden on small screens) */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-blue-100 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              {l.label}
              {l.label === "Cart" && <CartBadge count={totalItems} />}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button (hidden on larger screens) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex items-center text-white sm:hidden"
        >
          {/* Show the cart count next to the menu icon so it's visible without opening */}
          <CartBadge count={totalItems} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="flex flex-col border-t border-white/20 bg-blue-600 px-6 py-2 text-white sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-b border-white/10 py-3 text-sm font-medium last:border-b-0"
            >
              {l.label}
              {l.label === "Cart" && <CartBadge count={totalItems} />}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
