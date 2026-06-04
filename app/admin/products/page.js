import { cookies } from "next/headers";
import { getProducts } from "../../lib/products-store";
import { categories } from "../../products-data";
import {
  adminLogin,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "./actions";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const inputClass =
  "w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default async function AdminProductsPage({ searchParams }) {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === PASSWORD;
  const params = await searchParams;

  // --- Login gate ---
  if (!authed) {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <h2 className="text-2xl font-bold text-zinc-900">Admin login</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your password to manage products.
        </p>
        <form action={adminLogin} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className={inputClass}
          />
          {params?.error === "login" && (
            <p className="text-sm font-medium text-red-600">
              Wrong password. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h2 className="text-3xl font-bold text-zinc-900">Manage Products</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Add, edit, or remove products. Changes appear on the shop right away.
      </p>

      {/* Status messages */}
      {params?.added && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Product added.
        </p>
      )}
      {params?.saved && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Changes saved.
        </p>
      )}
      {params?.deleted && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Product deleted.
        </p>
      )}
      {params?.error === "fields" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          Please fill in at least a name and a price.
        </p>
      )}

      {/* Add new product */}
      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900">
          Add a new product
        </h3>
        <form
          action={createProductAction}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-1">
            Name
            <input name="name" required className={inputClass} />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Price (Rs)
            <input name="price" type="number" required className={inputClass} />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Old price (optional)
            <input name="oldPrice" type="number" className={inputClass} />
          </label>
          <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-3">
            Image path or URL (e.g. /products/earbuds.jpg)
            <input name="image" className={inputClass} />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Rating (0–5)
            <input name="rating" type="number" step="0.1" className={inputClass} />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Reviews
            <input name="reviews" type="number" className={inputClass} />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Category
            <select
              name="category"
              defaultValue="Accessories"
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-3">
            Description
            <textarea name="description" rows={2} className={inputClass} />
          </label>
          <label className="col-span-2 flex items-center gap-2 text-sm font-medium text-zinc-700 sm:col-span-3">
            <input type="checkbox" name="inStock" defaultChecked className="h-4 w-4" />
            In stock
          </label>
          <div className="col-span-2 sm:col-span-3">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Add product
            </button>
          </div>
        </form>
      </section>

      {/* Existing products */}
      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900">
          Current products ({products.length})
        </h3>
        <div className="space-y-3">
          {products.map((p) => (
            <form
              key={p.id || p.name}
              action={updateProductAction}
              className="grid grid-cols-2 items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-6"
            >
              <input type="hidden" name="id" defaultValue={p.id} />
              <label className="col-span-2 text-xs font-medium text-zinc-500">
                Name
                <input name="name" defaultValue={p.name} className={inputClass} />
              </label>
              <label className="text-xs font-medium text-zinc-500">
                Price
                <input
                  name="price"
                  type="number"
                  defaultValue={p.price}
                  className={inputClass}
                />
              </label>
              <label className="text-xs font-medium text-zinc-500">
                Old price
                <input
                  name="oldPrice"
                  type="number"
                  defaultValue={p.oldPrice ?? ""}
                  className={inputClass}
                />
              </label>
              <label className="text-xs font-medium text-zinc-500">
                Rating
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  defaultValue={p.rating ?? ""}
                  className={inputClass}
                />
              </label>
              <label className="text-xs font-medium text-zinc-500">
                Reviews
                <input
                  name="reviews"
                  type="number"
                  defaultValue={p.reviews ?? ""}
                  className={inputClass}
                />
              </label>
              <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-2">
                Category
                <select
                  name="category"
                  defaultValue={p.category || "Accessories"}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-4">
                Image
                <input
                  name="image"
                  defaultValue={p.image}
                  className={inputClass}
                />
              </label>
              <label className="col-span-2 text-xs font-medium text-zinc-500 sm:col-span-6">
                Description
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={p.description || ""}
                  className={inputClass}
                />
              </label>
              <label className="col-span-2 flex items-center gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
                <input
                  type="checkbox"
                  name="inStock"
                  defaultChecked={p.inStock !== false}
                  className="h-4 w-4"
                />
                In stock
              </label>
              <div className="col-span-2 flex gap-2 sm:col-span-4">
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteProductAction}
                  className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
