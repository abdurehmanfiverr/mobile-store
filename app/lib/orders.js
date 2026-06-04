// Order storage. If a database connection string is present (DATABASE_URL or
// POSTGRES_URL — added automatically when you connect a database in Vercel),
// orders are saved to the database. Otherwise it falls back to a local JSON
// file so everything still works on your computer with no setup.
import { promises as fs } from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const useDb = Boolean(connectionString);

// ---------- Local file fallback (no database configured) ----------
const dataDir = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");

async function getOrdersFromFile() {
  try {
    const raw = await fs.readFile(ordersFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveOrderToFile(order) {
  try {
    const orders = await getOrdersFromFile();
    orders.unshift(order);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Could not save order to file:", err);
    return false;
  }
}

// ---------- Database (Neon Postgres) ----------
async function getSql() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(connectionString);
}

// Create the orders table the first time it's needed (safe to run repeatedly).
async function ensureTable(sql) {
  await sql`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    data JSONB NOT NULL
  )`;
}

// ---------- Public API (same names as before — pages don't change) ----------
export async function getOrders() {
  if (!useDb) return getOrdersFromFile();
  try {
    const sql = await getSql();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM orders ORDER BY created_at DESC`;
    return rows.map((r) => r.data);
  } catch (err) {
    console.error("Database read failed, falling back to file:", err);
    return getOrdersFromFile();
  }
}

export async function saveOrder(order) {
  if (!useDb) return saveOrderToFile(order);
  try {
    const sql = await getSql();
    await ensureTable(sql);
    await sql`INSERT INTO orders (id, created_at, data)
      VALUES (${order.id}, ${order.createdAt}, ${JSON.stringify(order)}::jsonb)`;
    return true;
  } catch (err) {
    console.error("Database save failed:", err);
    return false;
  }
}

// Get the orders belonging to one customer (by their email).
export async function getOrdersByEmail(email) {
  if (!email) return [];
  const all = await getOrders();
  return all.filter((o) => o.userEmail === email);
}

// Change an order's status (e.g. "Confirmed", "Delivered").
export async function updateOrderStatus(id, status) {
  if (!useDb) {
    try {
      const orders = await getOrdersFromFile();
      const match = orders.find((o) => o.id === id);
      if (match) match.status = status;
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");
      return true;
    } catch (err) {
      console.error("Could not update order in file:", err);
      return false;
    }
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    // Merge {status: ...} into the stored JSON, overriding the old status.
    await sql`UPDATE orders
      SET data = data || ${JSON.stringify({ status })}::jsonb
      WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error("Database update failed:", err);
    return false;
  }
}
