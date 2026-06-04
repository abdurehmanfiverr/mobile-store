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
} from "../lib/users-store";
import { sendVerificationEmail, verificationEnabled } from "../lib/mailer";

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

  if (verificationEnabled) {
    // Verification is ON (a sending domain is configured): create the account
    // as unverified and email a confirmation link instead of logging in.
    const verifyToken = randomUUID();
    await createUser({ name, email, passwordHash, verified: false, verifyToken });

    const h = await headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    const verifyUrl = `${proto}://${host}/verify?token=${verifyToken}`;
    await sendVerificationEmail(email, name, verifyUrl);

    redirect("/account?check=email");
  }

  // Verification is OFF (no sending domain yet): keep the original behaviour —
  // mark verified and log the customer straight in.
  await createUser({ name, email, passwordHash, verified: true });
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
  // If verification is on, block accounts that haven't confirmed their email.
  if (verificationEnabled && user.verified === false) {
    redirect("/account?error=unverified");
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
