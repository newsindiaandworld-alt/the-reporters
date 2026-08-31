import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db, users } from "@/db";
import { updateAvatar } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { name, email, image } = session.user;

  const [dbUser] = await db
    .select({ avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const currentAvatar = dbUser?.avatarUrl ?? image;

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-white">
        Account Settings
      </h1>

      <div className="rounded-xl border border-neutral-800 bg-[#12141c] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 text-xl font-semibold text-white">
            {currentAvatar ? (
              <img src={currentAvatar} alt={name ?? "Account"} className="h-full w-full object-cover" />
            ) : (
              (name ?? email ?? "?").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{name ?? "Unnamed"}</p>
            <p className="text-sm text-neutral-400">{email}</p>
          </div>
        </div>

        <form action={updateAvatar} className="mt-6 space-y-3 border-t border-neutral-800 pt-6">
          <label className="block text-sm font-medium text-neutral-400">Profile Picture</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-neutral-700 file:px-3 file:py-1 file:text-white"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950"
          >
            Save Avatar
          </button>
        </form>

        <div className="mt-6 space-y-4 border-t border-neutral-800 pt-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-400">Name</label>
            <input
              type="text"
              defaultValue={name ?? ""}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-400">Email</label>
            <input
              type="email"
              defaultValue={email ?? ""}
              disabled
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-500"
            />
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-md bg-brand-gold px-3 py-2 text-sm font-semibold text-navy-950 opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
