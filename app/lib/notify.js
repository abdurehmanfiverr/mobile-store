// Sends an email alert to the shop owner when a new order is placed.
// It only runs if BOTH RESEND_API_KEY and ORDER_NOTIFY_EMAIL are set (you add
// these in Vercel). Without them, it does nothing — so checkout never breaks.
import { formatPrice } from "../products-data";

export async function notifyNewOrder(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;

  // Not configured yet — skip quietly.
  if (!apiKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const itemsHtml = order.items
      .map(
        (i) =>
          `<li>${i.name} × ${i.quantity} — ${formatPrice(
            i.price * i.quantity
          )}</li>`
      )
      .join("");

    await resend.emails.send({
      // While you don't have a custom domain, Resend lets you send from this
      // address to your own account email.
      from: "Mobile and Accessories <onboarding@resend.dev>",
      to,
      subject: `New order ${order.id} — ${formatPrice(order.total)}`,
      html: `
        <h2>New order: ${order.id}</h2>
        <p><strong>Customer:</strong> ${order.customer.name}<br/>
           <strong>Phone:</strong> ${order.customer.phone}<br/>
           <strong>Address:</strong> ${order.customer.address}${
        order.customer.city ? ", " + order.customer.city : ""
      }</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> ${formatPrice(order.total)} (${order.payment})</p>
      `,
    });
  } catch (err) {
    // Never let an email problem break the order.
    console.error("Order email failed:", err);
  }
}
