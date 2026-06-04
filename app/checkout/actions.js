"use server";

// "use server" marks this file's functions as Server Actions — they run on the
// server (never in the visitor's browser), so they can safely save data.
import { saveOrder } from "../lib/orders";
import { getCurrentUser } from "../lib/session";
import { getCoupon, couponDiscount } from "../lib/coupons";

export async function placeOrder(data) {
  const { customer, items, subtotal, deliveryFee, couponCode } = data || {};

  // Basic validation — make sure we have what we need.
  if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
    return { ok: false, error: "Please fill in your name, phone, and address." };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  // If the customer is logged in, tag the order with their email so it shows
  // up in their account's order history.
  const user = await getCurrentUser();

  // Re-check the coupon on the server (never trust the browser's numbers).
  const coupon = getCoupon(couponCode);
  const discount = couponDiscount(coupon, subtotal);
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  // Build the order record with a simple readable order number + timestamp.
  const order = {
    id: "ORD-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    userEmail: user?.email || null,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      city: (customer.city || "").trim(),
    },
    items,
    subtotal,
    deliveryFee,
    coupon: coupon ? couponCode.trim().toUpperCase() : null,
    discount,
    total,
    status: "Pending",
    payment: "Cash on Delivery",
  };

  const saved = await saveOrder(order);
  return { ok: true, orderId: order.id, saved };
}
