import { getCurrentUser } from "../lib/session";
import { getUserByEmail } from "../lib/users-store";
import { getOrdersByEmail } from "../lib/orders";
import AuthForms from "./AuthForms";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }) {
  const params = await searchParams;
  const current = await getCurrentUser();

  // Logged out → show the login / sign-up card.
  if (!current) {
    let notice = "";
    if (params?.verify === "failed")
      notice =
        "That verification link is invalid or has expired. Please log in or sign up again.";
    if (params?.reset === "success")
      notice = "Your password has been reset — please log in with your new password.";
    return <AuthForms notice={notice} />;
  }

  // Logged in → build the profile + their orders and show the dashboard.
  const fullUser = (await getUserByEmail(current.email)) || {};
  const profile = {
    name: fullUser.name || current.name,
    email: current.email,
    phone: fullUser.phone || "",
    address: fullUser.address || "",
    city: fullUser.city || "",
  };
  const orders = await getOrdersByEmail(current.email);

  return (
    <Dashboard
      profile={profile}
      orders={orders}
      justVerified={params?.verify === "success"}
    />
  );
}
