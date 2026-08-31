import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { db, articles, users } from "@/db";

export const dynamic = "force-dynamic";

function snippet(content: string, maxLength = 160): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const [profileUser] = await db
    .select({ id: users.id, name: users.name, email: users.email, avatarUrl: users.avatarUrl, image: users.image })
    .from(users)
    .where(eq(users.id, params.username))
    .limit(1);

  if (!profileUser) notFound();

  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.authorId, profileUser.id))
    .orderBy(desc(articles.createdAt));

  const published = rows.filter((a) => a.status === "published");
  const avatar = profileUser.avatarUrl ?? profileUser.image;

  return (
    <div className="py-8">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-800 bg-[#12141c] p-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 text-2xl font-semibold text-white">
          {avatar ? (
            <img src={avatar} alt={profileUser.name ?? "Reporter"} className="h-full w-full object-cover" />
          ) : (
            (profileUser.name ?? profileUser.email ?? "?").charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {profileUser.name ?? "Anonymous"}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {published.length} published {published.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>

      <h2 className="mb-6 mt-10 text-lg font-bold text-white">Published Articles</h2>

      {published.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">No published articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {published.map((article) => (
            <div
              key={article.id}
              className="flex flex-col bg-[#12141c] border border-neutral-800 rounded-xl overflow-hidden"
            >
              <Link href={`/article/${article.id}?feed=global`}>
                {article.imageUrl ? (
                  article.mediaType === "video" ? (
                    <video src={article.imageUrl} className="w-full h-48 object-cover" muted loop playsInline />
                  ) : (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                  )
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-zinc-950" />
                )}
              </Link>
              <div className="flex flex-col p-5">
                <Link href={`/article/${article.id}?feed=global`}>
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-white">
                    {article.title}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">
                  {snippet(article.content)}
                </p>
                <span className="mt-4 text-xs text-neutral-500">
                  {format(article.createdAt, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
