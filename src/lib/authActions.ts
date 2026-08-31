"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn, signOut } from "@/auth";

export async function signUp(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    redirect("/signup?error=invalid");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    redirect("/signup?error=exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name: typeof name === "string" && name.trim() ? name.trim() : null,
    email: normalizedEmail,
    password: passwordHash,
  });

  redirect("/login?registered=1");
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    revalidatePath("/", "layout");
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/studio",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw err; // rethrow so Next's internal redirect signal (success case) propagates
  }
}

export async function googleSignIn() {
  revalidatePath("/", "layout");
  await signIn("google", { redirectTo: "/studio" });
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
