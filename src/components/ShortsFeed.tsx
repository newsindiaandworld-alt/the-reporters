import { desc, eq } from "drizzle-orm";
import { db, articles } from "@/db";

// Server component: queries our own SQLite DB directly via Drizzle.
// No third-party News API involved anywhere in this feed.
export const dynamic = "force-dynamic";

function snippet(content: string, maxLength = 220): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export default async function ShortsFeed() {
  let rows: (typeof articles.$inferSelect)[] = [];

  try {
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt));
  } catch (err) {
    console.error("Failed to load published articles:", err);
    rows = [];
  }

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950 px-6 text-center">
        <p className="text-sm text-gray-400">No published dispatches yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
      {rows.map((article) => (
        <article
          key={article.id}
          className="h-full snap-start relative flex flex-col justify-end overflow-hidden bg-zinc-950"
        >
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-800 to-zinc-950" />
          )}

          {/* Dark gradient overlay behind the caption, TikTok-style */}
          <div className="relative z-10 bg-gradient-to-t from-black to-transparent p-6 pb-10 md:p-10">
            {article.location && (
              <p className="text-sm text-gray-300">{article.location}</p>
            )}
            <h2 className="mt-1 text-2xl font-bold text-white md:text-4xl">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-gray-300 line-clamp-3 md:text-base">
              {snippet(article.content)}
            </p>
            {article.reporterName && (
              <p className="mt-3 text-sm text-gray-300">Reported by {article.reporterName}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
