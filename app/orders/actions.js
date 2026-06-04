"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "../lib/orders";

// The admin password. Locally it defaults to "admin123". On the live site you
// set a strong one via the ADMIN_PASSWORD environment variable in Vercel.
const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Check the entered password; if correct, set a secure cookie that keeps you
// logged in for 7 days, then reload the Orders page.
export async function login(formData) {
  const entered = formData.get("password");

  if (entered === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", PASSWORD, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect("/orders");
  }

  // Wrong password — reload with an error flag.
  redirect("/orders?error=1");
}

// Log out by clearing the cookie.
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/orders");
}

// Change an order's status. Only works if you're logged in.
export async function setStatus(formData) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== PASSWORD) {
    redirect("/orders");
  }
  const id = formData.get("id");
  const status = formData.get("status");
  if (id && status) {
    await updateOrderStatus(id, status);
    revalidatePath("/orders");
  }
}
