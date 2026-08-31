import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// A SEPARATE, lightweight NextAuth instance built only from the edge-safe
// config — it shares AUTH_SECRET with the full instance in src/auth.ts, so
// it can verify the same signed JWT session cookie without touching the
// database or bcrypt (neither of which can run on the Edge runtime).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/studio"],
};
