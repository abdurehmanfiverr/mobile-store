import Link from "next/link";

// Footer shows on every page (added in the layout). No interactivity, so it
// stays a simple, fast component.
export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        {/* Store name and tagline */}
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <span>📱</span> Shehroz Mobiles and Accessories
          </p>
          <p className="mt-3 text-sm">
            Your trusted shop for original mobile accessories in Pakistan.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="transition-colors hover:text-white"
              >
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition-colors hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/return-policy"
                className="transition-colors hover:text-white"
              >
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment methods */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            We Accept
          </p>
          <p className="mt-3 text-sm">
            We accept Cash on Delivery, Bank Transfer, and Card payments.
          </p>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        &copy; 2026 Shehroz Mobiles and Accessories. All rights reserved.
      </div>
    </footer>
  );
}
