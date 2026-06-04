"use server";

import { redirect } from "next/navigation";

// Placeholder newsletter signup. Not connected to a mailing list yet — it just
// accepts the email and shows a thank-you. (Handled on the server so the email
// is never placed in the URL.)
export async function subscribe(formData) {
  const email = (formData.get("email") || "").toString().trim();
  if (email) {
    console.log("Newsletter signup:", email);
  }
  redirect("/?subscribed=1#newsletter");
}
