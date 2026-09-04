import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import { db, users } from "@/db";

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

const MAX_AGE = 30 * 24 * 60 * 60; // 30 days, matches Auth.js's default

async function validateCredentials(email: unknown, password: unknown) {
  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.password) return null;

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) return null;

  return user;
}

export async function POST(req: NextRequest) {
  // Diagnostic logging: confirms whether the WebView's request is actually
  // reaching this handler at all (vs. being blocked/redirected upstream at
  // Vercel's edge). Check Vercel's function logs after a login attempt.
  console.log("🚨 LOGIN ATTEMPT: request received", {
    origin: req.headers.get("origin"),
    host: req.headers.get("host"),
    referer: req.headers.get("referer"),
    userAgent: req.headers.get("user-agent"),
    contentType: req.headers.get("content-type"),
  });

  const contentType = req.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const body = isJson ? await req.json().catch(() => ({})) : await req.formData();
  const email = isJson ? body.email : body.get("email");
  const password = isJson ? body.password : body.get("password");

  console.log("🚨 LOGIN ATTEMPT: parsed body", { email, isJson });

  const user = await validateCredentials(email, password);

  // --- Native <form method="POST"> path: no client-side JS required at all.
  // We issue a real Auth.js-compatible session cookie server-side and reply
  // with an HTTP redirect, so this works even when hydration is unavailable
  // (e.g. inside a WebView that isn't running JS).
  if (!isJson) {
    if (!user) {
      console.log("🚨 LOGIN ATTEMPT: credentials rejected", { email });
      return NextResponse.redirect(new URL("/login?error=1", req.url), { status: 303 });
    }

    const sessionToken = await encode({
      token: { sub: user.id, email: user.email, name: user.name },
      secret: process.env.AUTH_SECRET!,
      salt: SESSION_COOKIE_NAME,
      maxAge: MAX_AGE,
    });

    console.log("🚨 LOGIN ATTEMPT: success, setting session cookie", {
      userId: user.id,
      cookieName: SESSION_COOKIE_NAME,
    });

    const response = NextResponse.redirect(new URL("/studio", req.url), { status: 303 });
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
    });
    return response;
  }

  // --- JSON path: kept for any JS-driven client that can still fetch/store
  // a bearer token (e.g. a future native wrapper), independent of cookies.
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await encode({
    token: { sub: user.id, email: user.email, name: user.name },
    secret: process.env.AUTH_SECRET!,
    salt: SESSION_COOKIE_NAME,
    maxAge: MAX_AGE,
  });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatarUrl ?? user.image ?? null,
    },
  });
}
