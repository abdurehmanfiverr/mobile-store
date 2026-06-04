import Stars from "./Stars";

// Sample written reviews (placeholder content for now).
const SAMPLE = [
  {
    name: "Ayesha K.",
    rating: 5,
    text: "Excellent quality and super fast delivery — exactly as described. Highly recommend!",
  },
  {
    name: "Bilal R.",
    rating: 4,
    text: "Good value for money. Works perfectly and the cash-on-delivery process was smooth.",
  },
  {
    name: "Sana M.",
    rating: 5,
    text: "Genuine product, nicely packaged, and arrived the next day. Will buy again.",
  },
];

export default function Reviews({ rating = 0, reviews = 0 }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold text-zinc-900">Customer Reviews</h2>

      <div className="mt-3 flex items-center gap-4">
        <span className="text-4xl font-extrabold text-zinc-900">
          {Number(rating).toFixed(1)}
        </span>
        <div>
          <Stars rating={rating} />
          <p className="text-sm text-zinc-500">Based on {reviews} reviews</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {SAMPLE.map((r) => (
          <div key={r.name} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900">{r.name}</span>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-2 text-sm text-zinc-600">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
