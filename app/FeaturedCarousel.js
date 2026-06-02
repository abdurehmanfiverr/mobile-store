"use client";

import Link from "next/link";
import { products, formatPrice, discountPercent } from "./products-data";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

// An auto-scrolling strip of products for the home page. The products are laid
// out twice; the CSS animation slides the strip left by half its width and
// loops, so it scrolls forever with no visible jump. It pauses on hover.
export default function FeaturedCarousel() {
  return (
    <div className="marquee-pause overflow-hidden py-2">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          // The second copy is hidden from screen readers so items aren't
          // announced twice.
          <ul key={copy} className="flex gap-6 pr-6" aria-hidden={copy === 1}>
            {products.map((product) => (
              <li key={product.name} className="w-44 shrink-0">
                <Link
                  href="/products"
                  className="group flex flex-col rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative mb-3 flex aspect-square items-center justify-center">
                    {product.oldPrice && (
                      <span className="absolute left-0 top-0 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        -{discountPercent(product.oldPrice, product.price)}%
                      </span>
                    )}
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      imgClassName="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      fallback={<span className="text-2xl">📷</span>}
                    />
                  </div>
                  <h3 className="line-clamp-1 text-sm font-semibold text-zinc-800">
                    {product.name}
                  </h3>
                  <Stars rating={product.rating} reviews={product.reviews} />
                  <div className="mt-1 flex items-baseline gap-2">
                    {product.oldPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
