import Link from "next/link";
import FeaturedCarousel from "./FeaturedCarousel";

// Clean line icons (SVG) used in the category and "Why shop" sections.
// stroke="currentColor" means the text-color class controls the icon color.
function Icon({ name }) {
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
  { label: "Chargers & Power", icon: "bolt", badge: "bg-amber-50 text-amber-600" },
  { label: "Wearables", icon: "watch", badge: "bg-emerald-50 text-emerald-600" },
  { label: "Accessories", icon: "phone", badge: "bg-rose-50 text-rose-600" },
];

// The points shown in the "Why shop with us" section.
const features = [
  {
    icon: "shield",
    badge: "bg-emerald-50 text-emerald-600",
    title: "Original Products",
    text: "Genuine items only, with brand warranty.",
  },
  {
    icon: "cash",
    badge: "bg-amber-50 text-amber-600",
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
    badge: "bg-rose-50 text-rose-600",
    title: "Easy Returns",
    text: "7 day return policy, no questions asked.",
  },
];

// The Home page. No buttons that change data, so it stays a simple, fast page.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero banner: a full-width gradient panel */}
      <section className="bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 px-6 py-24 text-center text-white sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Your Favourite Mobile Accessories, All in One Place
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-50">
            From wireless earbuds to fast chargers, smart watches to power
            banks, Shehroz Mobiles and Accessories brings you original products
            at prices you&apos;ll love. Free delivery on orders over Rs 8000.
          </p>
          <Link
            href="/products"
            className="mt-10 inline-block rounded-full bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Shop Now
          </Link>
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
        <FeaturedCarousel />
      </section>

      {/* Shop by Category — clean white tiles with tinted icons */}
      <section className="bg-white">
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

      {/* About blurb */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">About Us</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            At Shehroz Mobiles and Accessories, we make it simple to find the
            mobile accessories you need. From everyday essentials to the latest
            gadgets, every product is hand-picked for quality and offered at
            honest prices. Shop with confidence, pay on delivery, and enjoy fast
            shipping wherever you are in Pakistan.
          </p>
        </div>
      </section>
    </main>
  );
}
