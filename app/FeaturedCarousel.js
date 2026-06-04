"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatPrice, discountPercent } from "./products-data";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

// A horizontal strip showing ~4 product cards at once. The arrows scroll it
// left/right; on phones you can also swipe. Cards match the products page.
export default function FeaturedCarousel({ products = [] }) {
  const scrollerRef = useRef(null);

  function scrollByPage(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-6xl px-6">
      {/* Left / right scroll arrows (hidden on small screens — swipe instead) */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl text-zinc-700 shadow-md transition-colors hover:bg-zinc-50 sm:flex"
      >
        &#8249;
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl text-zinc-700 shadow-md transition-colors hover:bg-zinc-50 sm:flex"
      >
        &#8250;
      </button>

      {/* Scrollable row: 1 card on phones, 2 on tablet, 4 on desktop */}
      <ul
        ref={scrollerRef}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <li
            key={product.id || product.name}
            className="min-w-[80%] shrink-0 snap-start sm:min-w-[calc(50%_-_8px)] lg:min-w-[calc(25%_-_12px)]"
          >
            <div className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              {/* Image with discount badge */}
              <div className="relative mb-4">
                {product.inStock === false ? (
                  <span className="absolute left-0 top-0 z-10 rounded-md bg-zinc-700 px-2 py-1 text-xs font-bold text-white">
                    Out of stock
                  </span>
                ) : (
                  product.oldPrice && (
                    <span className="absolute left-0 top-0 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      -{discountPercent(product.oldPrice, product.price)}%
                    </span>
                  )
                )}
                <div className="flex aspect-square items-center justify-center">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    imgClassName="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    fallback={
                      <span className="px-2 text-center text-sm font-medium text-zinc-400">
                        📷
                        <br />
                        Photo coming soon
                      </span>
                    }
                  />
                </div>
              </div>

              <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-zinc-800">
                {product.name}
              </h3>

              <Stars rating={product.rating} reviews={product.reviews} />

              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                {product.oldPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                <span className="text-base font-bold text-zinc-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              <Link
                href={`/products/${product.id}`}
                className="mt-4 self-start rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
              >
                View Product
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
