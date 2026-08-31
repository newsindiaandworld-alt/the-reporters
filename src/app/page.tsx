import Link from "next/link";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { format } from "date-fns";
import { ArrowRight, Bookmark, Heart, Trash2 } from "lucide-react";
import { db, articles, users } from "@/db";
import { comments } from "@/db/schema";
import { auth } from "@/auth";
import { deleteOwnArticle, toggleLike, toggleBookmark, getEngagementData } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

type FeedArticle = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  location: string | null;
  createdAt: Date;
  reporterName: string | null;
  authorName: string | null;
  authorId: string;
  mediaType: "image" | "video";
};

function snippet(content: string, maxLength = 160): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const tab = searchParams.tab === "trending" ? "trending" : "latest";

  let rows: FeedArticle[] = [];

  try {
    rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        imageUrl: articles.imageUrl,
        location: articles.location,
        createdAt: articles.createdAt,
        reporterName: articles.reporterName,
        authorName: users.name,
        authorId: articles.authorId,
        mediaType: articles.mediaType,
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt));
  } catch (err) {
    console.error("Failed to load published articles:", err);
    rows = [];
  }

  const engagement = await getEngagementData(rows.map((r) => r.id), userId);

  const commentCounts = new Map<number, number>();
  if (rows.length > 0) {
    const commentRows = await db
      .select({ articleId: comments.articleId, count: sql<number>`count(*)` })
      .from(comments)
      .where(inArray(comments.articleId, rows.map((r) => r.id)))
      .groupBy(comments.articleId);
    for (const row of commentRows) commentCounts.set(row.articleId, Number(row.count));
  }

  if (tab === "trending") {
    rows = [...rows].sort((a, b) => {
      const scoreA = (engagement.likeCounts.get(a.id) ?? 0) + (commentCounts.get(a.id) ?? 0);
      const scoreB = (engagement.likeCounts.get(b.id) ?? 0) + (commentCounts.get(b.id) ?? 0);
      return scoreB - scoreA;
    });
  }

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
        Latest Local Updates
      </h1>

      <div className="mb-6 flex items-center gap-1 border-b border-neutral-800">
        <Link
          href="/?tab=latest"
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "latest"
              ? "border-b-2 border-brand-gold text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Latest
        </Link>
        <Link
          href="/?tab=trending"
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "trending"
              ? "border-b-2 border-brand-gold text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Trending
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          {tab === "trending"
            ? "No trending stories yet — check back soon."
            : "No published dispatches yet — check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {rows.map((article) => (
            <div
              key={article.id}
              className="flex flex-col bg-[#12141c] border border-neutral-800 rounded-xl overflow-hidden"
            >
              <Link href={`/article/${article.id}?feed=global`}>
                {article.imageUrl ? (
                  article.mediaType === "video" ? (
                    <video
                      src={article.imageUrl}
                      className="w-full h-48 object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
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
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-neutral-500">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {article.authorId ? (
                      <Link href={`/profile/${article.authorId}`} className="hover:text-neutral-300 hover:underline">
                        {article.authorName ?? article.reporterName ?? "Anonymous"}
                      </Link>
                    ) : (
                      <span>{article.authorName ?? article.reporterName ?? "Anonymous"}</span>
                    )}
                    <span aria-hidden="true">—</span>
                    <span>{format(article.createdAt, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <form action={toggleLike.bind(null, article.id)}>
                      <button
                        type="submit"
                        aria-label="Like article"
                        className={`flex items-center gap-1 transition-colors duration-200 ${
                          engagement.likedByMe.has(article.id)
                            ? "text-red-500"
                            : "text-neutral-500 hover:text-red-400"
                        }`}
                      >
                        <Heart size={14} fill={engagement.likedByMe.has(article.id) ? "currentColor" : "none"} />
                        {engagement.likeCounts.get(article.id) ?? 0}
                      </button>
                    </form>
                    <form action={toggleBookmark.bind(null, article.id)}>
                      <button
                        type="submit"
                        aria-label="Bookmark article"
                        className={`transition-colors duration-200 ${
                          engagement.bookmarkedByMe.has(article.id)
                            ? "text-brand-gold"
                            : "text-neutral-500 hover:text-brand-gold"
                        }`}
                      >
                        <Bookmark size={14} fill={engagement.bookmarkedByMe.has(article.id) ? "currentColor" : "none"} />
                      </button>
                    </form>
                    {userId === article.authorId && (
                      <ConfirmDeleteForm action={deleteOwnArticle.bind(null, article.id)}>
                        <input type="hidden" name="articleId" value={article.id} />
                        <button
                          type="submit"
                          aria-label="Delete article"
                          className="text-neutral-500 transition-colors duration-200 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </ConfirmDeleteForm>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
