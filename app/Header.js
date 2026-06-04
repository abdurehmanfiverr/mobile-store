"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import Logo from "./Logo";
import { logout } from "./account/actions";

function CartBadge({ count }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700">
      {count}
    </span>
  );
}

export default function Header({ user }) {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false); // mobile menu
  const [userOpen, setUserOpen] = useState(false); // desktop account dropdown

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center text-white" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-blue-100 sm:flex">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <Link href="/products" className="transition-colors hover:text-white">Products</Link>

          {/* Account area */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-1 transition-colors hover:text-white"
              >
                Hi, {firstName}
                <span className="text-xs">▾</span>
              </button>
              {userOpen && (
                <>
                  <button
                    type="button"
                    aria-hidden
                    onClick={() => setUserOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 text-zinc-700 shadow-lg">
                    <Link href="/account" onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-50">My Account</Link>
                    <Link href="/account" onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-50">My Orders</Link>
                    <form action={logout}>
                      <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-50">Log out</button>
                    </form>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/account" className="transition-colors hover:text-white">Log In</Link>
          )}

          <Link href="/cart" className="flex items-center gap-2 transition-colors hover:text-white">
            Cart
            <CartBadge count={totalItems} />
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex items-center text-white sm:hidden"
        >
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
          <Link href="/" onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-sm font-medium">Home</Link>
          <Link href="/products" onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-sm font-medium">Products</Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 border-b border-white/10 py-3 text-sm font-medium">
            Cart <CartBadge count={totalItems} />
          </Link>
          {user ? (
            <>
              <Link href="/account" onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-sm font-medium">My Account ({firstName})</Link>
              <form action={logout}>
                <button type="submit" className="py-3 text-sm font-medium text-blue-50">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/account" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">Log In</Link>
          )}
        </nav>
      )}
    </header>
  );
}
