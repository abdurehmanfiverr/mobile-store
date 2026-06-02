// Shared data used by several pages. Keeping it in one file means we only
// edit products, prices, or delivery rules in a single place.

// "image" points to a photo in public/products/.
// "oldPrice" (optional) shows a discount badge + struck-through original price.
// "rating" (out of 5) and "reviews" power the star rating shown on each card.
export const products = [
  {
    name: "Wireless Earbuds",
    price: 5999,
    oldPrice: 7999,
    image: "/products/earbuds.jpg",
    rating: 4.5,
    reviews: 128,
  },
  {
    name: "Fast Charger",
    price: 1499,
    image: "/products/charger.jpg",
    rating: 4,
    reviews: 64,
  },
  {
    name: "Smart Watch",
    price: 8999,
    oldPrice: 11999,
    image: "/products/smartwatch.jpg",
    rating: 4.5,
    reviews: 96,
  },
  {
    name: "Power Bank",
    price: 3499,
    oldPrice: 4499,
    image: "/products/powerbank.jpg",
    rating: 4,
    reviews: 210,
  },
  {
    name: "Phone Case",
    price: 899,
    oldPrice: 1299,
    image: "/products/phonecase.jpg",
    rating: 5,
    reviews: 342,
  },
  {
    name: "Screen Protector",
    price: 499,
    oldPrice: 799,
    image: "/products/screenprotector.jpg",
    rating: 4.5,
    reviews: 180,
  },
  {
    name: "Bluetooth Speaker",
    price: 4499,
    oldPrice: 5999,
    image: "/products/speaker.jpg",
    rating: 4,
    reviews: 75,
  },
  {
    name: "USB-C Cable",
    price: 699,
    image: "/products/usbccable.jpg",
    rating: 4.5,
    reviews: 156,
  },
  {
    name: "Car Charger",
    price: 1299,
    oldPrice: 1799,
    image: "/products/carcharger.jpg",
    rating: 4,
    reviews: 52,
  },
  {
    name: "Wireless Charging Pad",
    price: 2999,
    oldPrice: 3999,
    image: "/products/wirelesscharger.jpg",
    rating: 4.5,
    reviews: 89,
  },
  {
    name: "Selfie Stick",
    price: 1199,
    image: "/products/selfiestick.jpg",
    rating: 4,
    reviews: 41,
  },
  {
    name: "Phone Tripod",
    price: 1999,
    oldPrice: 2499,
    image: "/products/tripod.jpg",
    rating: 4.5,
    reviews: 63,
  },
  {
    name: "Memory Card 128GB",
    price: 2499,
    oldPrice: 2999,
    image: "/products/memorycard.jpg",
    rating: 5,
    reviews: 204,
  },
  {
    name: "Gaming Controller",
    price: 3999,
    oldPrice: 4999,
    image: "/products/controller.jpg",
    rating: 4.5,
    reviews: 118,
  },
];

// Delivery rules: a flat fee, but free once the subtotal reaches the threshold.
export const DELIVERY_FEE = 199;
export const FREE_DELIVERY_THRESHOLD = 8000;

// Shows a number as "Rs 5,999" with comma separators.
export function formatPrice(amount) {
  return "Rs " + amount.toLocaleString("en-PK");
}

// Works out the discount percentage, e.g. 7999 -> 5999 is 25%.
export function discountPercent(oldPrice, price) {
  return Math.round((1 - price / oldPrice) * 100);
}
