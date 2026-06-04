import { getCurrentUser } from "../lib/session";
import { getUserByEmail } from "../lib/users-store";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const current = await getCurrentUser();

  // Pre-fill from the logged-in customer's saved profile (if any).
  let initial = { name: "", phone: "", email: "", address: "", city: "" };
  if (current) {
    const u = (await getUserByEmail(current.email)) || {};
    initial = {
      name: u.name || current.name || "",
      phone: u.phone || "",
      email: current.email || "",
      address: u.address || "",
      city: u.city || "",
    };
  }

  return <CheckoutForm initial={initial} />;
}
