import { auth } from "@/auth";

// Same signature/name as before, so lib/actions.ts and the API routes that
// already import { isAuthenticated } from "@/lib/serverAuth" need no changes
// — only the implementation moved from the old passcode cookie to NextAuth.
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
