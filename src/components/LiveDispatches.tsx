import { and, desc, eq, gte } from "drizzle-orm";
import { db, articles } from "@/db";
import DeleteArticleButton from "@/components/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function LiveDispatches() {
  let rows: (typeof articles.$inferSelect)[] = [];

  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    rows = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.status, "published"),
          gte(articles.createdAt, oneDayAgo)
        )
      )
      .orderBy(desc(articles.createdAt))
      .limit(6);
  } catch (err) {
    console.error("Failed to load live dispatches:", err);
    return null;
  }

  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-navy-300">
        Live from the Editorial Desk
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rows.map((article) => (
          <div
            key={article.id}
            className="rounded-md border border-slate-200 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-navy-800 dark:hover:border-navy-600 dark:hover:shadow-black/40"
          >
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="mb-3 h-32 w-full rounded object-cover"
              />
            )}
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-navy-400">
                {article.dispatchType.replace("_", " ")}
              </p>
              <DeleteArticleButton id={article.id} />
            </div>
            <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              {article.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 dark:text-navy-400">
              {article.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
