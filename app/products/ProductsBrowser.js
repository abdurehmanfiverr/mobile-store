"use client";

import { useState, useMemo } from "react";
import { categories } from "../products-data";
import ProductGrid from "./ProductGrid";

// Discount as a fraction (0 if not on sale) — used for "Biggest Discount" sort.
function discountFraction(p) {
  return p.oldPrice ? 1 - p.price / p.oldPrice : 0;
}

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

export default function ProductsBrowser({ products }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");

  const filterButtons = ["All", ...categories];

  // Filter by category + search, then sort. Recomputed only when inputs change.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (q === "" || p.name.toLowerCase().includes(q))
    );

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "discount")
      list = [...list].sort((a, b) => discountFraction(b) - discountFraction(a));
    // "featured" keeps the original order

    return list;
  }, [products, category, sort, query]);

  return (
    <div>
      {/* Search + sort row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          Sort by:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Category filter buttons */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterButtons.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          No products found. Try a different search or category.
        </p>
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
