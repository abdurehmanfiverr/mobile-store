// Customer account storage. Database when DATABASE_URL/POSTGRES_URL is set,
// else a local JSON file. Passwords are stored only as bcrypt hashes.
import { promises as fs } from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const useDb = Boolean(connectionString);

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

const normalize = (email) => (email || "").toLowerCase().trim();

async function readUsers() {
  try {
    return JSON.parse(await fs.readFile(usersFile, "utf8"));
  } catch {
    return [];
  }
}

async function writeUsers(list) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(list, null, 2), "utf8");
}

async function getSql() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(connectionString);
}

async function ensureTable(sql) {
  await sql`CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    data JSONB NOT NULL
  )`;
}

export async function getUserByEmail(email) {
  email = normalize(email);
  if (!useDb) {
    const list = await readUsers();
    return list.find((u) => u.email === email) || null;
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM users WHERE email = ${email}`;
    return rows[0]?.data || null;
  } catch (err) {
    console.error("User DB read failed:", err);
    return null;
  }
}

export async function createUser(user) {
  const record = { ...user, email: normalize(user.email) };
  if (!useDb) {
    const list = await readUsers();
    list.push(record);
    await writeUsers(list);
    return record;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`INSERT INTO users (email, data) VALUES (${record.email}, ${JSON.stringify(record)}::jsonb)`;
  return record;
}

export async function setUserToken(email, token) {
  email = normalize(email);
  if (!useDb) {
    const list = await readUsers();
    const u = list.find((x) => x.email === email);
    if (u) u.token = token;
    await writeUsers(list);
    return;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`UPDATE users SET data = data || ${JSON.stringify({ token })}::jsonb WHERE email = ${email}`;
}

export async function getUserByToken(token) {
  if (!token) return null;
  if (!useDb) {
    const list = await readUsers();
    return list.find((u) => u.token === token) || null;
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM users WHERE data->>'token' = ${token}`;
    return rows[0]?.data || null;
  } catch (err) {
    console.error("User token lookup failed:", err);
    return null;
  }
}

// Marks a user as verified using their email-verification token, and clears
// the token. Returns the user (or null if the token isn't found).
export async function verifyUserByToken(token) {
  if (!token) return null;
  if (!useDb) {
    const list = await readUsers();
    const u = list.find((x) => x.verifyToken === token);
    if (!u) return null;
    u.verified = true;
    delete u.verifyToken;
    await writeUsers(list);
    return u;
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM users WHERE data->>'verifyToken' = ${token}`;
    const u = rows[0]?.data;
    if (!u) return null;
    const updated = { ...u, verified: true };
    delete updated.verifyToken;
    await sql`UPDATE users SET data = ${JSON.stringify(updated)}::jsonb WHERE email = ${u.email}`;
    return updated;
  } catch (err) {
    console.error("Verify-by-token failed:", err);
    return null;
  }
}

// Merge fields into a user record (profile edits, reset tokens, new password).
export async function updateUser(email, partial) {
  email = normalize(email);
  if (!useDb) {
    const list = await readUsers();
    const u = list.find((x) => x.email === email);
    if (u) Object.assign(u, partial);
    await writeUsers(list);
    return u || null;
  }
  try {
    const sql = await getSql();
    await ensureTable(sql);
    await sql`UPDATE users SET data = data || ${JSON.stringify(partial)}::jsonb WHERE email = ${email}`;
    const rows = await sql`SELECT data FROM users WHERE email = ${email}`;
    return rows[0]?.data || null;
  } catch (err) {
    console.error("updateUser failed:", err);
    return null;
  }
}

// Find a user by a valid (non-expired) password-reset token.
export async function getUserByResetToken(token) {
  if (!token) return null;
  let user = null;
  if (!useDb) {
    const list = await readUsers();
    user = list.find((x) => x.resetToken === token) || null;
  } else {
    try {
      const sql = await getSql();
      await ensureTable(sql);
      const rows = await sql`SELECT data FROM users WHERE data->>'resetToken' = ${token}`;
      user = rows[0]?.data || null;
    } catch (err) {
      console.error("reset-token lookup failed:", err);
      return null;
    }
  }
  if (!user) return null;
  if (user.resetExpires && Date.now() > user.resetExpires) return null;
  return user;
}

export async function clearUserToken(token) {
  if (!token) return;
  if (!useDb) {
    const list = await readUsers();
    const u = list.find((x) => x.token === token);
    if (u) delete u.token;
    await writeUsers(list);
    return;
  }
  const sql = await getSql();
  await ensureTable(sql);
  await sql`UPDATE users SET data = data - 'token' WHERE data->>'token' = ${token}`;
}
