// Product storage. Uses the database when DATABASE_URL/POSTGRES_URL is set,
// otherwise a local JSON file. Seeded from the default product list so the
// shop is never empty. Same graceful pattern as the orders store.
import { promises as fs } from "fs";
import path from "path";
import { products as defaultProducts } from "../products-data";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const useDb = Boolean(connectionString);

const dataDir = path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");

// Lets already-saved products pick up newer fields (category, description)
// from the defaults if they don't have them yet.
const defaultsById = Object.fromEntries(defaultProducts.map((p) => [p.id, p]));
function withDefaults(p) {
  const d = defaultsById[p.id];
  if (!d) return p;
  return { category: d.category, description: d.description, ...p };
}

// Make a URL-friendly id from a product name.
function makeId(name) {
  const base =
    String(name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "product";
  return base + "-" + Math.random().toString(36).slice(2, 6);
}

// ---------- Local file fallback ----------
async function readFile() {
  try {
    const raw = await fs.readFile(productsFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return null; // not created yet
  }
}

async function writeFile(list) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(productsFile, JSON.stringify(list, null, 2), "utf8");
}

// ---------- Database ----------
async function getSql() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(connectionString);
}

async function ensureTable(sql) {
  await sql`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    seq SERIAL,
    data JSONB NOT NULL
  )`;
}

// ---------- Public API ----------
export async function getProducts() {
  if (!useDb) {
    const list = await readFile();
    if (list) return list.map(withDefaults);
    // First run: seed the file with the defaults (best-effort).
    try {
      await writeFile(defaultProducts);
    } catch {
      /* read-only host: just return defaults */
    }
    return defaultProducts;
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    let rows = await sql`SELECT data FROM products ORDER BY seq`;
    if (rows.length === 0) {
      // Seed defaults the first time.
      for (const p of defaultProducts) {
        await sql`INSERT INTO products (id, data) VALUES (${p.id}, ${JSON.stringify(p)}::jsonb)
          ON CONFLICT (id) DO NOTHING`;
      }
      rows = await sql`SELECT data FROM products ORDER BY seq`;
    }
    return rows.map((r) => withDefaults(r.data));
  } catch (err) {
    console.error("Product DB read failed, using defaults:", err);
    return defaultProducts;
  }
}

// Get a single product by its id (or null if not found).
export async function getProductById(id) {
  const all = await getProducts();
  return all.find((p) => p.id === id) || null;
}

export async function addProduct(product) {
  const item = { ...product, id: makeId(product.name) };
  if (!useDb) {
    const list = (await readFile()) || [...defaultProducts];
    list.push(item);
    await writeFile(list);
    return item;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`INSERT INTO products (id, data) VALUES (${item.id}, ${JSON.stringify(item)}::jsonb)`;
  return item;
}

export async function updateProduct(id, product) {
  const item = { ...product, id };
  if (!useDb) {
    const list = (await readFile()) || [...defaultProducts];
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) list[idx] = item;
    await writeFile(list);
    return item;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`UPDATE products SET data = ${JSON.stringify(item)}::jsonb WHERE id = ${id}`;
  return item;
}

export async function deleteProduct(id) {
  if (!useDb) {
    const list = (await readFile()) || [...defaultProducts];
    await writeFile(list.filter((p) => p.id !== id));
    return true;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`DELETE FROM products WHERE id = ${id}`;
  return true;
}
