import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "../../lib/products-store";
import { formatPrice, discountPercent } from "../../products-data";
import Stars from "../../Stars";
import ProductImage from "../../ProductImage";
import AddToCartButton from "../AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Link
        href="/products"
        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
      >
        &larr; Back to Products
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Large product image */}
        <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8">
          {product.oldPrice && (
            <span className="absolute left-4 top-4 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
              -{discountPercent(product.oldPrice, product.price)}%
            </span>
          )}
          <ProductImage
            src={product.image}
            alt={product.name}
            imgClassName="h-full w-full object-contain"
            fallback={
              <span className="text-center text-sm font-medium text-zinc-400">
                📷
                <br />
                Photo coming soon
              </span>
            }
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium text-blue-600">{product.category}</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-lg text-zinc-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-3xl font-extrabold text-zinc-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-zinc-600">
            {product.description ||
              "A quality mobile accessory from Mobile and Accessories."}
          </p>

          <div className="mt-8">
            {product.inStock === false ? (
              <span className="inline-block rounded-full bg-zinc-200 px-8 py-3 text-base font-semibold text-zinc-500">
                Out of stock
              </span>
            ) : (
              <AddToCartButton product={product} />
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Cash on Delivery available · Free delivery on orders over Rs 8000.
          </p>
        </div>
      </div>
    </main>
  );
}
