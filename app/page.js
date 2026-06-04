import Link from "next/link";
import FeaturedCarousel from "./FeaturedCarousel";
import ProductGrid from "./products/ProductGrid";
import Stars from "./Stars";
import { getProducts } from "./lib/products-store";
import { subscribe } from "./newsletter-actions";

// Read products fresh so newly added ones appear in the Trending strip.
export const dynamic = "force-dynamic";

// Clean line icons (SVG) used in the category and "Why shop" sections.
// stroke="currentColor" means the text-color class controls the icon color.
function Icon({ name, size = 28 }) {
  const shapes = {
    headphones: (
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    ),
    bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    watch: (
      <>
        <circle cx="12" cy="12" r="6" />
        <polyline points="12 10 12 12 13 13" />
        <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
        <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
      </>
    ),
    phone: (
      <>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    cash: (
      <>
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </>
    ),
    truck: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
    return: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}

// Category tiles. "badge" is the soft tinted circle behind each icon.
const categories = [
  { label: "Audio", icon: "headphones", badge: "bg-blue-50 text-blue-600" },
  { label: "Chargers & Power", icon: "bolt", badge: "bg-blue-50 text-blue-600" },
  { label: "Wearables", icon: "watch", badge: "bg-blue-50 text-blue-600" },
  { label: "Accessories", icon: "phone", badge: "bg-blue-50 text-blue-600" },
];

// The points shown in the "Why shop with us" section.
const features = [
  {
    icon: "shield",
    badge: "bg-blue-50 text-blue-600",
    title: "Original Products",
    text: "Genuine items only, with brand warranty.",
  },
  {
    icon: "cash",
    badge: "bg-blue-50 text-blue-600",
    title: "Cash on Delivery",
    text: "Pay when your order arrives at your door.",
  },
  {
    icon: "truck",
    badge: "bg-blue-50 text-blue-600",
    title: "Fast Delivery",
    text: "Quick and reliable shipping across Pakistan.",
  },
  {
    icon: "return",
    badge: "bg-blue-50 text-blue-600",
    title: "Easy Returns",
    text: "7 day return policy, no questions asked.",
  },
];

// Trust badges shown in the thin strip under the hero.
const badges = [
  { icon: "users", title: "10,000+", text: "Happy Customers" },
  { icon: "shield", title: "Original", text: "Products" },
  { icon: "truck", title: "Free Delivery", text: "over Rs 8000" },
  { icon: "cash", title: "Cash on Delivery", text: "Available" },
];

// Sample customer reviews shown in the testimonials section.
const testimonials = [
  {
    name: "Ayesha K.",
    quote:
      "Original products and super fast delivery — my earbuds arrived the very next day. Highly recommended!",
  },
  {
    name: "Bilal R.",
    quote:
      "Great prices and genuine items. The fast charger works perfectly. I'll definitely order again.",
  },
  {
    name: "Sana M.",
    quote:
      "Smooth experience, and cash on delivery made it so easy. The smart watch is excellent quality.",
  },
];

// The Home page.
export default async function Home({ searchParams }) {
  const products = await getProducts();
  const params = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero banner: two columns (text left, product image right) on desktop;
          stacked on mobile. Keeps the blue gradient background. */}
      <section className="bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 sm:py-20 lg:flex-row lg:gap-12 lg:py-28">
          {/* Left: heading, subheading, button */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Your Favourite Mobile Accessories, All in One Place
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-blue-50 lg:mx-0">
              From wireless earbuds to fast chargers, smart watches to power
              banks, Mobile and Accessories brings you original
              products at prices you&apos;ll love. Free delivery on orders over
              Rs 8000.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Shop Now
            </Link>
          </div>

          {/* Right: a cluster of product photos in clean white cards */}
          <div className="flex flex-1 justify-center">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {[
                { image: "/products/smartwatch.jpg", name: "Smart Watch" },
                { image: "/products/earbuds.jpg", name: "Wireless Earbuds" },
                { image: "/products/speaker.jpg", name: "Bluetooth Speaker" },
                { image: "/products/powerbank.jpg", name: "Power Bank" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-4 shadow-xl transition-transform hover:-translate-y-1 sm:h-40 sm:w-40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges strip directly under the hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-4">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex items-center justify-center gap-3 sm:justify-start"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon name={b.icon} size={20} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-zinc-900">{b.title}</p>
                <p className="text-xs text-zinc-500">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now — an auto-scrolling strip of products */}
      <section className="py-16">
        <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between px-6">
          <h2 className="text-3xl font-bold text-zinc-900">Trending Now</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            View all &rarr;
          </Link>
        </div>
        <FeaturedCarousel products={products} />
      </section>

      {/* Best Sellers — product cards matching the products page */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-zinc-900">Best Sellers</h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
            >
              View all &rarr;
            </Link>
          </div>
          <ProductGrid products={products.slice(0, 4)} />
        </div>
      </section>

      {/* Shop by Category — clean tiles with tinted icons */}
      <section className="bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-zinc-900">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.label}
                href="/products"
                className="group flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${category.badge}`}
                >
                  <Icon name={category.icon} />
                </span>
                <span className="font-semibold text-zinc-800">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional sale banner — colourful, contrasting break */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-400 px-8 py-12 text-center shadow-lg sm:py-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Big Sale — Up to 30% Off Selected Accessories
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Grab your favourite earbuds, chargers, smart watches and more before
            the deals run out.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-800 shadow transition-transform hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* Why shop with us */}
      <section className="bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="mb-10 text-center text-3xl font-bold text-zinc-900">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${feature.badge}`}
                >
                  <Icon name={feature.icon} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer testimonials */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="mb-10 text-center text-3xl font-bold text-zinc-900">
            What Our Customers Say
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm"
              >
                <Stars rating={5} />
                <p className="mt-3 text-zinc-600">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About blurb */}
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">About Us</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            At Mobile and Accessories, we make it simple to find the
            mobile accessories you need. From everyday essentials to the latest
            gadgets, every product is hand-picked for quality and offered at
            honest prices. Shop with confidence, pay on delivery, and enjoy fast
            shipping wherever you are in Pakistan.
          </p>
        </div>
      </section>

      {/* Newsletter signup strip (dark, blends into the footer) */}
      <section id="newsletter" className="bg-zinc-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stay Updated — Get the Latest Deals
          </h2>
          <p className="mt-3 text-zinc-400">
            Subscribe for new arrivals, discounts, and exclusive offers straight
            to your inbox.
          </p>
          <form
            action={subscribe}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
            >
              Subscribe
            </button>
          </form>
          {params?.subscribed && (
            <p className="mt-4 text-sm font-medium text-emerald-400">
              Thanks for subscribing! 🎉
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
