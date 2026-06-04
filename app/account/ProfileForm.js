"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function ProfileForm({ profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    const res = await updateProfile(new FormData(e.currentTarget));
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(res.error || "Could not save. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <p className="text-sm text-zinc-500">
        Your saved details are used to pre-fill checkout.
      </p>

      {saved && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          Profile saved.
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <label className="block text-sm font-medium text-zinc-700">
        Full name
        <input name="name" defaultValue={profile.name || ""} required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Phone number
        <input name="phone" defaultValue={profile.phone || ""} placeholder="03xx-xxxxxxx" className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Delivery address
        <textarea name="address" rows={3} defaultValue={profile.address || ""} className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        City
        <input name="city" defaultValue={profile.city || ""} className={inputClass} />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
