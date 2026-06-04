import { redirect } from "next/navigation";

// Orders now live in the admin area.
export default function OrdersRedirect() {
  redirect("/admin/orders");
}
