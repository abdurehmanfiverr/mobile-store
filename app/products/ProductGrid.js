"use client";

import Link from "next/link";
import { formatPrice, discountPercent } from "../products-data";
import { useCart } from "../CartContext";
import ProductImage from "../ProductImage";
import Stars from "../Stars";

// Renders a uniform grid of product cards. Each card links to its detail page
// (image + name + rating + price), with a separate Add to Cart button.
export default function ProductGrid({ products }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => {
        const outOfStock = product.inStock === false;
        return (
          <div
            key={product.id || product.name}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Clicking the image / name / price opens the detail page */}
            <Link
              href={`/products/${product.id}`}
              className="flex flex-1 flex-col"
            >
              {/* Uniform image area: fixed square, white background */}
              <div className="relative flex aspect-square items-center justify-center bg-white p-4">
                {outOfStock ? (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-zinc-700 px-2 py-1 text-xs font-bold text-white">
                    Out of stock
                  </span>
                ) : (
                  product.oldPrice && (
                    <span className="absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      -{discountPercent(product.oldPrice, product.price)}%
                    </span>
                  )
                )}
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  imgClassName={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                    outOfStock ? "opacity-50" : ""
                  }`}
                  fallback={
                    <span className="px-2 text-center text-sm font-medium text-zinc-400">
                      📷
                      <br />
                      Photo coming soon
                    </span>
                  }
                />
              </div>

              <div className="flex flex-1 flex-col px-4 pt-3">
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-zinc-800 transition-colors group-hover:text-blue-600">
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
              </div>
            </Link>

            {/* Add to Cart (or a disabled Out of stock button) */}
            <div className="px-4 pb-4 pt-3">
              {outOfStock ? (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-500"
                >
                  Out of stock
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
