"use client";

import { products, formatPrice, discountPercent } from "../products-data";
import { useCart } from "../CartContext";
import ProductImage from "../ProductImage";
import Stars from "../Stars";

export default function ProductsPage() {
  // Grab the addToCart action from the shared cart box.
  const { addToCart } = useCart();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      {/* Section header with a subtitle */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Featured Products
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-500">
          Hand-picked mobile accessories — original products at honest prices,
          delivered across Pakistan.
        </p>
      </div>

      {/* Borderless grid — products sit on the page background. */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          // No box by default; on hover a white card with a shadow lifts it out.
          <div
            key={product.name}
            className="group flex flex-col rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
          >
            {/* Image, with an optional discount badge in the corner */}
            <div className="relative mb-4">
              {product.oldPrice && (
                <span className="absolute left-0 top-0 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  -{discountPercent(product.oldPrice, product.price)}%
                </span>
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

            {/* Name — turns blue on hover, like the reference. Clamped to 2 lines. */}
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-zinc-800 transition-colors group-hover:text-blue-600">
              {product.name}
            </h3>

            {/* Star rating + review count */}
            <Stars rating={product.rating} reviews={product.reviews} />

            {/* Price: old price struck through (if on sale) + current price */}
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

            {/* Rounded pill "Add to cart" button */}
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="mt-4 self-start rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
