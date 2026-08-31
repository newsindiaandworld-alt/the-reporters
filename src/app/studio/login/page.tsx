import { redirect } from "next/navigation";

// The old passcode login lived here. Auth is now handled by NextAuth at
// /login, so this route just forwards there — kept in place (rather than
// deleted, which I can't do on your machine) so no old link/bookmark 404s.
// Safe to delete this whole src/app/studio/login/ folder if you'd rather.
export default function LegacyStudioLoginRedirect() {
  redirect("/login");
}
