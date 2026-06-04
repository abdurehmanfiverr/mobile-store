// The Contact page (/contact). A real message form (saved on the server) plus
// your direct contact details. Update the email/phone below with real info.
import { sendMessage } from "./actions";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h2 className="text-3xl font-bold text-zinc-900">Contact Us</h2>
      <p className="mt-4 text-lg text-zinc-600">
        Have a question about an order or a product? Send us a message below, or
        reach us directly — we&apos;d love to help.
      </p>

      {/* Message form */}
      <form
        action={sendMessage}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <h3 className="text-lg font-semibold text-zinc-900">
          Send us a message
        </h3>

        {params?.sent && (
          <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Thanks! Your message has been sent — we&apos;ll get back to you soon.
          </p>
        )}
        {params?.error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            Please fill in your name, email, and message.
          </p>
        )}

        <label className="block text-sm font-medium text-zinc-700">
          Name
          <input type="text" name="name" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input type="email" name="email" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Message
          <textarea name="message" rows={4} required className={inputClass} />
        </label>

        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600"
        >
          Send message
        </button>
      </form>

      {/* Direct contact details */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Email
          </p>
          <p className="mt-1 text-zinc-900">support@shehrozmobiles.pk</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Phone / WhatsApp
          </p>
          <p className="mt-1 text-zinc-900">+92 300 0000000</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Hours
          </p>
          <p className="mt-1 text-zinc-900">Mon–Sat, 10 AM – 8 PM</p>
        </div>
      </div>
    </main>
  );
}
