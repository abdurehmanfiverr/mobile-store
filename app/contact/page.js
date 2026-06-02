// The Contact page (/contact). Static text, so it stays a simple, fast page.
// Update the email and phone below with your real contact details.
export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h2 className="text-3xl font-bold text-zinc-900">Contact Us</h2>
      <p className="mt-4 text-lg text-zinc-600">
        Have a question about an order or a product? We&apos;d love to hear from
        you. Reach us through any of the options below and we&apos;ll get back
        to you as soon as we can.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Email
          </p>
          <p className="mt-1 text-lg text-zinc-900">
            support@shehrozmobiles.pk
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Phone / WhatsApp
          </p>
          <p className="mt-1 text-lg text-zinc-900">+92 300 0000000</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Hours
          </p>
          <p className="mt-1 text-lg text-zinc-900">
            Monday to Saturday, 10:00 AM to 8:00 PM
          </p>
        </div>
      </div>
    </main>
  );
}
