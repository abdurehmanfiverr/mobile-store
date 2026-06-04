"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup, requestPasswordReset } from "./actions";

const inputBase =
  "w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Small inline icons
function Svg({ children }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
const MailIcon = () => (
  <Svg>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Svg>
);
const LockIcon = () => (
  <Svg>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);
const UserIcon = () => (
  <Svg>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

export default function AuthForms({ notice }) {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(notice || "");

  function switchMode(m) {
    setMode(m);
    setError("");
    setInfo("");
    setShowPw(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(new FormData(e.currentTarget));
    if (res.ok) {
      setInfo(`Welcome back, ${res.name}!`);
      setTimeout(() => router.refresh(), 700);
    } else {
      setError(res.error);
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signup(new FormData(e.currentTarget));
    if (res.ok) {
      if (res.needsVerification) {
        setInfo("Account created! Please check your email to verify your account, then log in.");
        setLoading(false);
        setMode("login");
      } else {
        setInfo(`Welcome, ${res.name}!`);
        setTimeout(() => router.refresh(), 700);
      }
    } else {
      setError(res.error);
      setLoading(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await requestPasswordReset(new FormData(e.currentTarget));
    setLoading(false);
    setInfo(
      res.emailEnabled
        ? "If that email is registered, we've sent a reset link. Please check your inbox."
        : "Password reset by email isn't available yet — please contact us and we'll help you reset it."
    );
  }

  const passwordField = (autoComplete) => (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        <LockIcon />
      </span>
      <input
        type={showPw ? "text" : "password"}
        name="password"
        required
        autoComplete={autoComplete}
        placeholder="Password"
        className={inputBase}
      />
      <button
        type="button"
        onClick={() => setShowPw((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-800"
      >
        {showPw ? "Hide" : "Show"}
      </button>
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* Blue header strip */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-6 text-center text-white">
          <h2 className="text-2xl font-bold">
            {mode === "forgot" ? "Reset Password" : "My Account"}
          </h2>
          <p className="mt-1 text-sm text-blue-50">
            {mode === "forgot"
              ? "We'll email you a reset link"
              : "Log in or create an account"}
          </p>
        </div>

        {/* Tabs (hidden in forgot mode) */}
        {mode !== "forgot" && (
          <div className="flex border-b border-zinc-200">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          {info && (
            <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
              {info}
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MailIcon />
                </span>
                <input type="email" name="email" required autoComplete="email" placeholder="Email" className={inputBase} />
              </div>
              {passwordField("current-password")}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
              >
                {loading ? "Please wait…" : "Log In"}
              </button>
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <UserIcon />
                </span>
                <input type="text" name="name" required autoComplete="name" placeholder="Full name" className={inputBase} />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MailIcon />
                </span>
                <input type="email" name="email" required autoComplete="email" placeholder="Email" className={inputBase} />
              </div>
              {passwordField("new-password")}
              <p className="text-xs text-zinc-400">At least 6 characters.</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
              >
                {loading ? "Please wait…" : "Create Account"}
              </button>
            </form>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MailIcon />
                </span>
                <input type="email" name="email" required placeholder="Your email" className={inputBase} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
              >
                {loading ? "Please wait…" : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to log in
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
