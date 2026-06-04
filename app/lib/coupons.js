// Discount codes customers can enter at checkout. Edit this list to add or
// change codes. "percent" takes a % off the subtotal; "flat" takes a fixed
// number of rupees off.
export const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  WELCOME15: { type: "percent", value: 15, label: "15% off" },
  FLAT500: { type: "flat", value: 500, label: "Rs 500 off" },
};

// Look up a coupon by code (case-insensitive). Returns null if it doesn't exist.
export function getCoupon(code) {
  if (!code) return null;
  return COUPONS[code.trim().toUpperCase()] || null;
}

// Work out the rupee discount for a coupon against a given subtotal.
export function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  // flat amount, never more than the subtotal
  return Math.min(coupon.value, subtotal);
}
