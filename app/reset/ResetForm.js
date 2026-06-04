"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "../account/actions";

export default function ResetForm({ token }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("token", token);
    const res = await resetPassword(fd);
    if (res.ok) {
      router.push("/account?reset=success");
    } else {
      setError(res.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-6 text-center text-white">
          <h2 className="text-2xl font-bold">Set a new password</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {!token && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              This reset link is missing its token. Please use the link from your email.
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <label className="block text-sm font-medium text-zinc-700">
            New password
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 pr-14 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-800"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Reset password"}
          </button>
        </form>
      </div>
    </main>
  );
}
