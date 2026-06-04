// Default product list. Seeds the store and is the fallback when no storage is
// available. Each product has a stable "id", a "category" (for filters), and a
// "description" (shown on the product detail page).
export const products = [
  {
    id: "earbuds",
    name: "Wireless Earbuds",
    price: 5999,
    oldPrice: 7999,
    image: "/products/earbuds.jpg",
    rating: 4.5,
    reviews: 128,
    category: "Audio",
    description:
      "Crystal-clear sound with deep bass, noise isolation, and long battery life. Perfect for music, calls, and workouts.",
  },
  {
    id: "charger",
    name: "Fast Charger",
    price: 1499,
    image: "/products/charger.jpg",
    rating: 4,
    reviews: 64,
    category: "Chargers & Power",
    description:
      "Charge your phone in record time with this fast, safe, and compact charger compatible with most modern devices.",
  },
  {
    id: "smartwatch",
    name: "Smart Watch",
    price: 8999,
    oldPrice: 11999,
    image: "/products/smartwatch.jpg",
    rating: 4.5,
    reviews: 96,
    category: "Wearables",
    description:
      "Track your fitness, notifications, and calls right from your wrist, with a bright display and all-day battery.",
  },
  {
    id: "powerbank",
    name: "Power Bank",
    price: 3499,
    oldPrice: 4499,
    image: "/products/powerbank.jpg",
    rating: 4,
    reviews: 210,
    category: "Chargers & Power",
    description:
      "A high-capacity power bank to keep your devices charged on the go, with fast-charge support and multiple ports.",
  },
  {
    id: "phonecase",
    name: "Phone Case",
    price: 899,
    oldPrice: 1299,
    image: "/products/phonecase.jpg",
    rating: 5,
    reviews: 342,
    category: "Accessories",
    description:
      "Slim, durable protection that guards your phone against drops and scratches without adding bulk.",
  },
  {
    id: "screenprotector",
    name: "Screen Protector",
    price: 499,
    oldPrice: 799,
    image: "/products/screenprotector.jpg",
    rating: 4.5,
    reviews: 180,
    category: "Accessories",
    description:
      "Tempered-glass protection that keeps your screen scratch-free and crystal clear, with bubble-free installation.",
  },
  {
    id: "speaker",
    name: "Bluetooth Speaker",
    price: 4499,
    oldPrice: 5999,
    image: "/products/speaker.jpg",
    rating: 4,
    reviews: 75,
    category: "Audio",
    description:
      "Portable Bluetooth speaker with rich, room-filling sound and a battery that lasts all day.",
  },
  {
    id: "usbccable",
    name: "USB-C Cable",
    price: 699,
    image: "/products/usbccable.jpg",
    rating: 4.5,
    reviews: 156,
    category: "Chargers & Power",
    description:
      "Strong, tangle-free USB-C cable built for fast charging and quick data transfer.",
  },
  {
    id: "carcharger",
    name: "Car Charger",
    price: 1299,
    oldPrice: 1799,
    image: "/products/carcharger.jpg",
    rating: 4,
    reviews: 52,
    category: "Chargers & Power",
    description:
      "Charge two devices at once on the road with this compact, fast car charger.",
  },
  {
    id: "wirelesscharger",
    name: "Wireless Charging Pad",
    price: 2999,
    oldPrice: 3999,
    image: "/products/wirelesscharger.jpg",
    rating: 4.5,
    reviews: 89,
    category: "Chargers & Power",
    description:
      "Just set your phone down to charge — a sleek wireless pad with fast, safe charging.",
  },
  {
    id: "selfiestick",
    name: "Selfie Stick",
    price: 1199,
    image: "/products/selfiestick.jpg",
    rating: 4,
    reviews: 41,
    category: "Accessories",
    description:
      "Capture the perfect group shot or vlog with this lightweight, extendable selfie stick.",
  },
  {
    id: "tripod",
    name: "Phone Tripod",
    price: 1999,
    oldPrice: 2499,
    image: "/products/tripod.jpg",
    rating: 4.5,
    reviews: 63,
    category: "Accessories",
    description:
      "A flexible, sturdy tripod for stable photos, videos, and video calls anywhere.",
  },
  {
    id: "memorycard",
    name: "Memory Card 128GB",
    price: 2499,
    oldPrice: 2999,
    image: "/products/memorycard.jpg",
    rating: 5,
    reviews: 204,
    category: "Accessories",
    description:
      "Expand your storage with 128GB of fast, reliable space for photos, videos, and apps.",
  },
  {
    id: "controller",
    name: "Gaming Controller",
    price: 3999,
    oldPrice: 4999,
    image: "/products/controller.jpg",
    rating: 4.5,
    reviews: 118,
    category: "Accessories",
    description:
      "A comfortable, responsive wireless controller for smooth mobile and PC gaming.",
  },
];

// The category names used by the filter bar (in display order).
export const categories = [
  "Audio",
  "Chargers & Power",
  "Wearables",
  "Accessories",
];

// Delivery rules: a flat fee, but free once the subtotal reaches the threshold.
export const DELIVERY_FEE = 199;
export const FREE_DELIVERY_THRESHOLD = 8000;

// Shows a number as "Rs 5,999" with comma separators.
export function formatPrice(amount) {
  return "Rs " + Number(amount).toLocaleString("en-PK");
}

// Works out the discount percentage, e.g. 7999 -> 5999 is 25%.
export function discountPercent(oldPrice, price) {
  return Math.round((1 - price / oldPrice) * 100);
}
