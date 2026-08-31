import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, ne, and, desc } from "drizzle-orm";
import { format } from "date-fns";
import { Heart, Bookmark } from "lucide-react";
import { db, articles, users } from "@/db";
import { comments } from "@/db/schema";
import { auth } from "@/auth";
import { deleteOwnArticle, toggleLike, toggleBookmark, getEngagementData, addComment, deleteComment } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

function parseInline(text: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}

function renderMarkdownBody(content: string): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-6 space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  content.split("\n").forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(
        <h2 key={i} className="text-2xl md:text-3xl font-bold text-white mt-2">
          {parseInline(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed.length > 0) {
      flushList();
      blocks.push(<p key={i}>{parseInline(trimmed)}</p>);
    }
  });
  flushList();
  return blocks;
}

interface ArticlePageProps {
  params: { slug: string };
  searchParams: { feed?: string };
}

async function ArticleSlide({
  article,
  isOwner,
  likeCount,
  isLiked,
  isBookmarked,
  isLoggedIn,
  currentUserId,
}: {
  article: typeof articles.$inferSelect;
  isOwner: boolean;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isLoggedIn: boolean;
  currentUserId?: string;
}) {
  const articleComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userId: comments.userId,
      authorName: users.name,
      userAvatar: users.avatarUrl,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.articleId, article.id))
    .orderBy(desc(comments.createdAt));

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] snap-start flex flex-col items-center justify-start bg-[#0a0b10] py-4 md:py-10">
      <div className="w-full max-w-4xl mx-auto aspect-video bg-black md:rounded-2xl overflow-hidden mb-8 shadow-2xl border border-neutral-800 shrink-0">
        {article.imageUrl ? (
          article.mediaType === "video" ? (
            <video
              src={article.imageUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 md:px-0 flex flex-col text-left">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-gold hover:underline"
        >
          ← Back to News
        </Link>

        {article.location && (
          <span className="mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-semibold text-brand-gold">
            📍 {article.location}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 mt-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400 mb-8">
          <span>Reported by {article.reporterName ?? "Anonymous"}</span>
          <span aria-hidden="true">·</span>
          <span>{format(article.createdAt, "MMM d, yyyy")}</span>
          {isOwner && (
            <>
              <span aria-hidden="true">·</span>
              <ConfirmDeleteForm action={deleteOwnArticle.bind(null, article.id)}>
                <button
                  type="submit"
                  className="text-neutral-500 hover:text-red-400 text-xs transition-colors"
                >
                  Delete
                </button>
              </ConfirmDeleteForm>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <form action={toggleLike.bind(null, article.id)}>
            <button
              type="submit"
              aria-label="Like article"
              className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                isLiked ? "text-red-500" : "text-gray-300 hover:text-red-400"
              }`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              {likeCount}
            </button>
          </form>
          <form action={toggleBookmark.bind(null, article.id)}>
            <button
              type="submit"
              aria-label="Bookmark article"
              className={`transition-colors duration-200 ${
                isBookmarked ? "text-brand-gold" : "text-gray-300 hover:text-brand-gold"
              }`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </form>
        </div>

        <div className="space-y-4 text-lg md:text-2xl text-gray-200 leading-snug md:leading-relaxed">
          {renderMarkdownBody(article.content)}
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8">
          <h2 className="mb-6 text-lg font-bold text-white">
            Comments ({articleComments.length})
          </h2>

          {isLoggedIn ? (
            <form action={addComment} className="mb-8 flex flex-col gap-3">
              <input type="hidden" name="articleId" value={article.id} />
              <textarea
                name="content"
                required
                rows={3}
                placeholder="Add a comment..."
                className="w-full rounded-md border border-neutral-700 bg-[#12141c] px-3 py-2 text-sm text-gray-200 placeholder:text-neutral-500 focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                className="self-start rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-navy-950 transition-colors duration-200 hover:opacity-90"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="mb-8 text-sm text-gray-400">
              <Link href="/login" className="text-brand-gold hover:underline">
                Sign in
              </Link>{" "}
              to leave a comment.
            </p>
          )}

          <div className="flex flex-col">
            {articleComments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 mb-3">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.authorName ?? "User"}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white">
                    {(comment.authorName ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {comment.authorName ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {format(comment.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                  {currentUserId === comment.userId && (
                    <ConfirmDeleteForm action={deleteComment} className="mt-1">
                      <input type="hidden" name="commentId" value={comment.id} />
                      <button type="submit" className="text-xs text-neutral-500 hover:text-red-500 hover:underline">
                        Delete
                      </button>
                    </ConfirmDeleteForm>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const id = Number(params.slug);
  if (!Number.isInteger(id)) notFound();

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  if (!article || article.status !== "published") notFound();

  const rest =
    searchParams.feed === "global"
      ? await db
          .select()
          .from(articles)
          .where(and(eq(articles.status, "published"), ne(articles.id, article.id)))
          .orderBy(desc(articles.createdAt))
      : await db
          .select()
          .from(articles)
          .where(
            and(
              eq(articles.status, "published"),
              eq(articles.category, article.category),
              ne(articles.id, article.id)
            )
          )
          .orderBy(desc(articles.createdAt));

  const session = await auth();
  const userId = session?.user?.id;

  const feed = [article, ...rest];
  const engagement = await getEngagementData(feed.map((a) => a.id), userId);

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory bg-black scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {feed.map((a) => (
        <ArticleSlide
          key={a.id}
          article={a}
          isOwner={Boolean(userId && userId === a.authorId)}
          likeCount={engagement.likeCounts.get(a.id) ?? 0}
          isLiked={engagement.likedByMe.has(a.id)}
          isBookmarked={engagement.bookmarkedByMe.has(a.id)}
          isLoggedIn={Boolean(userId)}
          currentUserId={userId}
        />
      ))}
    </div>
  );
}
