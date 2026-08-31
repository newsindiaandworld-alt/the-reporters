'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db, articles } from '@/db';
import { users, likes, bookmarks, comments } from '@/db/schema';
import { isAuthenticated } from '@/lib/serverAuth';
import { auth } from '@/auth';
import { b2 } from '@/lib/b2';

const BUCKET = process.env.B2_BUCKET_NAME || 'the-reporters-media-2026';

export interface Dispatch {
  id: string;
  title: string;
  dispatch_type: 'audio_memo' | 'video_short' | 'breaking_alert' | 'article';
  location: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  reporter: string;
}

export async function getNearbyDispatches(): Promise<Dispatch[]> {
  return [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Overturned truck blocks MG Road junction',
      dispatch_type: 'breaking_alert',
      location: 'MG Road, Bengaluru',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Voice memo: crowd gathers outside city hall',
      dispatch_type: 'audio_memo',
      location: 'City Hall, Bengaluru',
    },
  ];
}

export async function getLatestArticles(): Promise<Article[]> {
  return [
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'City council approves new metro line extension',
      summary: 'The extension will add six stations across the eastern corridor.',
      reporter: 'Asha Rao',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Monsoon repairs to begin on flood-prone underpasses',
      summary: 'Civic body allocates emergency funds ahead of peak rainfall.',
      reporter: 'Vikram Shetty',
    },
  ];
}

export async function deleteArticle(id: number): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized');
  }
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath('/');
}

export async function deleteOwnArticle(articleId: number): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const [article] = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
  if (!article || article.authorId !== userId) throw new Error('Unauthorized');

  await db.delete(articles).where(eq(articles.id, articleId));
  revalidatePath('/');
  redirect('/');
}

export async function toggleLike(articleId: number): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const [existing] = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.articleId, articleId)))
    .limit(1);

  if (existing) {
    await db.delete(likes).where(eq(likes.id, existing.id));
  } else {
    await db.insert(likes).values({ userId, articleId });
  }

  revalidatePath('/');
}

export async function toggleBookmark(articleId: number): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
    .limit(1);

  if (existing) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
  } else {
    await db.insert(bookmarks).values({ userId, articleId });
  }

  revalidatePath('/');
}

export async function addComment(formData: FormData): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const articleId = Number(formData.get('articleId'));
  const content = formData.get('content');

  if (!Number.isInteger(articleId) || typeof content !== 'string' || content.trim().length === 0) {
    return;
  }

  await db.insert(comments).values({ articleId, userId, content: content.trim() });
  revalidatePath(`/article/${articleId}`);
}

export async function deleteComment(formData: FormData): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const commentId = Number(formData.get('commentId'));
  if (!Number.isInteger(commentId)) throw new Error('Invalid comment');

  const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);
  if (!comment || comment.userId !== userId) throw new Error('Unauthorized');

  const articleId = comment.articleId;
  await db.delete(comments).where(eq(comments.id, commentId));
  revalidatePath(`/article/${articleId}`);
}

export async function getEngagementData(articleIds: number[], userId?: string) {
  if (articleIds.length === 0) {
    return {
      likeCounts: new Map<number, number>(),
      likedByMe: new Set<number>(),
      bookmarkedByMe: new Set<number>(),
    };
  }

  const likeRows = await db.select().from(likes).where(inArray(likes.articleId, articleIds));
  const bookmarkRows = userId
    ? await db
        .select()
        .from(bookmarks)
        .where(and(inArray(bookmarks.articleId, articleIds), eq(bookmarks.userId, userId)))
    : [];

  const likeCounts = new Map<number, number>();
  const likedByMe = new Set<number>();
  for (const row of likeRows) {
    likeCounts.set(row.articleId, (likeCounts.get(row.articleId) ?? 0) + 1);
    if (userId && row.userId === userId) likedByMe.add(row.articleId);
  }

  return { likeCounts, likedByMe, bookmarkedByMe: new Set(bookmarkRows.map((r) => r.articleId)) };
}

export async function updateAvatar(formData: FormData): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const file = formData.get('avatar');
  if (!(file instanceof File) || file.size === 0) {
    redirect('/settings?error=avatar');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  await b2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: cleanFileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const avatarUrl = `https://${BUCKET}.s3.${
    process.env.B2_REGION || 'eu-central-003'
  }.backblazeb2.com/${cleanFileName}`;

  await db.update(users).set({ avatarUrl }).where(eq(users.id, userId));

  revalidatePath('/', 'layout');
  redirect('/settings');
}

// Public — anyone can submit a tip. It always lands with status "pending"
// (the schema default) so it only appears once an editor approves it.
export async function submitTip(formData: FormData): Promise<void> {
  const title = formData.get('title');
  const content = formData.get('content');
  const reporterName = formData.get('reporterName');
  const location = formData.get('location');

  const isNonEmptyString = (value: FormDataEntryValue | null): value is string =>
    typeof value === 'string' && value.trim().length > 0;

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(content) ||
    !isNonEmptyString(reporterName) ||
    !isNonEmptyString(location)
  ) {
    redirect('/submit-tip?error=1');
  }

  const session = await auth();

  await db.insert(articles).values({
    title: title.trim(),
    content: content.trim(),
    reporterName: reporterName.trim(),
    location: location.trim(),
    authorId: session?.user?.id ?? "",
    // status is intentionally omitted — the schema default ("pending") applies.
  });

  redirect('/submit-tip?submitted=1');
}
