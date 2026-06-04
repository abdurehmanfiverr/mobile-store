"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  createUser,
  setUserToken,
  clearUserToken,
} from "../lib/users-store";

// Create a session: a random token saved on the user + a secure cookie.
async function startSession(email) {
  const token = randomUUID();
  await setUserToken(email, token);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function signup(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const password = (formData.get("password") || "").toString();

  if (!name || !email || password.length < 6) {
    redirect("/account?error=signup");
  }
  const existing = await getUserByEmail(email);
  if (existing) {
    redirect("/account?error=exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser({ name, email, passwordHash });
  await startSession(email);
  redirect("/account");
}

export async function login(formData) {
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const password = (formData.get("password") || "").toString();

  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect("/account?error=login");
  }
  await startSession(email);
  redirect("/account");
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) await clearUserToken(token);
  cookieStore.delete("session");
  redirect("/account");
}
