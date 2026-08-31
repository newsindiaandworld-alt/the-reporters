import { desc, eq } from "drizzle-orm";
import { db, articles } from "@/db";

// Server component: queries our own SQLite DB directly via Drizzle.
// No third-party News API involved anywhere in this feed.
export const dynamic = "force-dynamic";

function snippet(content: string, maxLength = 160): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export default async function HeroGrid() {
  let rows: (typeof articles.$inferSelect)[] = [];

  try {
    rows = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt));
  } catch (err) {
    console.error("Failed to load published articles:", err);
    return null;
  }

  if (rows.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-slate-500 dark:text-navy-400">
        No published dispatches yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((article) => (
        <article
          key={article.id}
          className="rounded-md border border-slate-200 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-navy-800 dark:hover:border-navy-600 dark:hover:shadow-black/40"
        >
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="mb-4 h-40 w-full rounded object-cover"
            />
          )}
          {article.location && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-gold">
              {article.location}
            </p>
          )}
          <h2 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-slate-900 dark:text-white">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-navy-200">
            {snippet(article.content)}
          </p>
          {article.reporterName && (
            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-navy-400">
              Reported by {article.reporterName}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
