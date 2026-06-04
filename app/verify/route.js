import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifyUserByToken, setUserToken } from "../lib/users-store";

// Handles the link from the verification email: /verify?token=...
// It marks the account verified, logs the customer in, and redirects.
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  const user = await verifyUserByToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/account?verify=failed", request.url));
  }

  // Log them in by issuing a session token + cookie.
  const sessionToken = randomUUID();
  await setUserToken(user.email, sessionToken);

  const res = NextResponse.redirect(
    new URL("/account?verify=success", request.url)
  );
  res.cookies.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
