// Storage for contact-form messages. Database when connected, local file
// otherwise — same graceful pattern as orders.
import { promises as fs } from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const useDb = Boolean(connectionString);

const dataDir = path.join(process.cwd(), "data");
const messagesFile = path.join(dataDir, "messages.json");

async function getFromFile() {
  try {
    return JSON.parse(await fs.readFile(messagesFile, "utf8"));
  } catch {
    return [];
  }
}

async function saveToFile(msg) {
  try {
    const list = await getFromFile();
    list.unshift(msg);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(messagesFile, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Could not save message to file:", err);
    return false;
  }
}

async function getSql() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(connectionString);
}

async function ensureTable(sql) {
  await sql`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    data JSONB NOT NULL
  )`;
}

export async function getMessages() {
  if (!useDb) return getFromFile();
  try {
    const sql = await getSql();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM messages ORDER BY created_at DESC`;
    return rows.map((r) => r.data);
  } catch (err) {
    console.error("Message DB read failed, falling back to file:", err);
    return getFromFile();
  }
}

export async function saveMessage(msg) {
  if (!useDb) return saveToFile(msg);
  try {
    const sql = await getSql();
    await ensureTable(sql);
    await sql`INSERT INTO messages (id, created_at, data)
      VALUES (${msg.id}, ${msg.createdAt}, ${JSON.stringify(msg)}::jsonb)`;
    return true;
  } catch (err) {
    console.error("Message DB save failed:", err);
    return false;
  }
}
