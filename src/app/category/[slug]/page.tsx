import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { db, articles, users } from "@/db";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: { slug: string };
}

function snippet(content: string, maxLength = 160): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName =
    params.slug.charAt(0).toUpperCase() + params.slug.slice(1).toLowerCase();

  let rows: {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    reporterName: string | null;
    authorName: string | null;
  }[] = [];

  try {
    rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        imageUrl: articles.imageUrl,
        createdAt: articles.createdAt,
        reporterName: articles.reporterName,
        authorName: users.name,
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(and(eq(articles.status, "published"), eq(articles.category, categoryName)))
      .orderBy(desc(articles.createdAt));
  } catch (err) {
    console.error("Failed to load category articles:", err);
    rows = [];
  }

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
        {categoryName}
      </h1>

      {rows.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          No published {categoryName} dispatches yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {rows.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="flex flex-col bg-[#12141c] border border-neutral-800 rounded-xl overflow-hidden"
            >
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-zinc-950" />
              )}
              <div className="flex flex-col p-5">
                <h2 className="text-lg font-semibold leading-snug tracking-tight text-white">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">
                  {snippet(article.content)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                  <span>{article.authorName ?? article.reporterName ?? "Anonymous"}</span>
                  <span aria-hidden="true">—</span>
                  <span>{format(article.createdAt, "MMM d, yyyy")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
