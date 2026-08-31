"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { googleSignIn } from "@/lib/authActions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleConfigured = Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(true);
      setIsSubmitting(false);
      return;
    }

    // Hard redirect (not router.push) so the whole app remounts and
    // useSession in the Navbar picks up the freshly-set session cookie.
    window.location.href = "/studio";
  };

  return (
    <div className="max-w-sm mx-auto p-4 mt-16 bg-white border border-slate-200 rounded-xl dark:bg-navy-900 dark:border-navy-800">
      <h1 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Log In</h1>

      {error && (
        <p className="mb-4 text-xs text-red-600 dark:text-red-400">
          Invalid email or password.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      {googleConfigured && (
        <form action={googleSignIn} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 dark:border-navy-700 dark:text-white"
          >
            Continue with Google
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-xs text-slate-500 dark:text-navy-400">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-brand-gold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
