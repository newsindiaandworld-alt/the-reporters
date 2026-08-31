import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config: no adapter, no bcrypt, no better-sqlite3 import here.
// It's used both by the full server config (src/auth.ts) and by the
// lightweight middleware instance, which MUST stay edge-compatible.

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export default {
  pages: {
    signIn: "/login",
  },
  providers: googleConfigured
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnStudio = request.nextUrl.pathname.startsWith("/studio");
      return isOnStudio ? isLoggedIn : true;
    },
  },
} satisfies NextAuthConfig;
