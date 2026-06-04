import Link from "next/link";
import { cookies } from "next/headers";
import { getMessages } from "../../lib/messages-store";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function AdminMessagesPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === PASSWORD;

  // Not logged in: send them to the Orders page to log in (shared login).
  if (!authed) {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Messages</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Please log in first to view customer messages.
        </p>
        <Link
          href="/orders"
          className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          Go to login &rarr;
        </Link>
      </main>
    );
  }

  const messages = await getMessages();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold text-zinc-900">Messages</h2>
      <p className="mb-8 text-sm text-zinc-500">
        {messages.length} message{messages.length === 1 ? "" : "s"} from the
        contact form.
      </p>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-zinc-900">{m.name}</span>
                <span className="text-xs text-zinc-400">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-blue-600">{m.email}</p>
              <p className="mt-3 whitespace-pre-line text-zinc-700">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
