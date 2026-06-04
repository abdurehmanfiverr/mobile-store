"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  createUser,
  setUserToken,
  clearUserToken,
  updateUser,
  getUserByResetToken,
} from "../lib/users-store";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  verificationEnabled,
} from "../lib/mailer";
import { getCurrentUser } from "../lib/session";

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Create a session: a random token saved on the user + a secure cookie.
async function startSession(email) {
  const token = randomUUID();
  await setUserToken(email, token);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function baseUrl() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

// --- These return { ok, error, ... } so the client can show inline feedback ---

export async function login(formData) {
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const password = (formData.get("password") || "").toString();

  if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!password) return { ok: false, error: "Please enter your password." };

  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { ok: false, error: "Wrong email or password." };
  }
  if (verificationEnabled && user.verified === false) {
    return { ok: false, error: "Please verify your email first — check your inbox." };
  }
  await startSession(email);
  return { ok: true, name: user.name };
}

export async function signup(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const password = (formData.get("password") || "").toString();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const existing = await getUserByEmail(email);
  if (existing) return { ok: false, error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  if (verificationEnabled) {
    const verifyToken = randomUUID();
    await createUser({ name, email, passwordHash, verified: false, verifyToken });
    await sendVerificationEmail(email, name, `${await baseUrl()}/verify?token=${verifyToken}`);
    return { ok: true, needsVerification: true };
  }

  await createUser({ name, email, passwordHash, verified: true });
  await startSession(email);
  return { ok: true, name };
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) await clearUserToken(token);
  cookieStore.delete("session");
  redirect("/account");
}

export async function updateProfile(formData) {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "You're not logged in." };

  const name = (formData.get("name") || "").toString().trim();
  if (!name) return { ok: false, error: "Name can't be empty." };

  await updateUser(current.email, {
    name,
    phone: (formData.get("phone") || "").toString().trim(),
    address: (formData.get("address") || "").toString().trim(),
    city: (formData.get("city") || "").toString().trim(),
  });
  return { ok: true };
}

export async function requestPasswordReset(formData) {
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const user = await getUserByEmail(email);
  if (user) {
    const resetToken = randomUUID();
    await updateUser(email, { resetToken, resetExpires: Date.now() + 60 * 60 * 1000 });
    await sendPasswordResetEmail(email, `${await baseUrl()}/reset?token=${resetToken}`);
  }
  // Always respond the same way (don't reveal whether the email is registered).
  return { ok: true, emailEnabled: verificationEnabled };
}

export async function resetPassword(formData) {
  const token = (formData.get("token") || "").toString();
  const password = (formData.get("password") || "").toString();

  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const user = await getUserByResetToken(token);
  if (!user) return { ok: false, error: "This reset link is invalid or has expired." };

  const passwordHash = await bcrypt.hash(password, 10);
  await updateUser(user.email, { passwordHash, resetToken: null, resetExpires: null });
  return { ok: true };
}
