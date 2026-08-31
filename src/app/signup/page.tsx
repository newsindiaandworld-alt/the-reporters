import Link from "next/link";
import { signUp } from "@/lib/authActions";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-sm mx-auto p-4 mt-16 bg-white border border-slate-200 rounded-xl dark:bg-navy-900 dark:border-navy-800">
      <h1 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Sign Up</h1>

      <form action={signUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-navy-300 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
          <p className="mt-1 text-[11px] text-slate-500 dark:text-navy-400">
            At least 8 characters.
          </p>
        </div>

        {searchParams.error === "exists" && (
          <p className="text-xs text-red-600 dark:text-red-400">
            An account with that email already exists.
          </p>
        )}
        {searchParams.error === "invalid" && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Please enter a valid email and an 8+ character password.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500 dark:text-navy-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-gold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
