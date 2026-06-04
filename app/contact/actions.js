"use server";

import { redirect } from "next/navigation";
import { saveMessage } from "../lib/messages-store";

export async function sendMessage(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    redirect("/contact?error=1");
  }

  await saveMessage({
    id: "MSG-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    name,
    email,
    message,
  });

  redirect("/contact?sent=1");
}
