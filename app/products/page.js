import { getProducts } from "../lib/products-store";
import ProductsBrowser from "./ProductsBrowser";

// Read products fresh (so admin edits show up immediately).
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Our Products
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-500">
          Hand-picked mobile accessories — original products at honest prices,
          delivered across Pakistan.
        </p>
      </div>

      <ProductsBrowser products={products} />
    </main>
  );
}
