import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, articles } from "@/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, dispatchType, category, imageUrl, mediaType } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    let article;
    try {
      [article] = await db
        .insert(articles)
        .values({
          title,
          content,
          dispatchType: dispatchType || "Article",
          category: category || "General",
          imageUrl: imageUrl || null,
          mediaType: mediaType === "video" ? "video" : "image",
          status: "published",
          authorId: session.user.id,
          reporterName: session.user.name ?? null,
        })
        .returning();
    } catch (insertError: any) {
      console.error("Article insert failed:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to insert article" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Failed to save article:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save article" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(20);

    return NextResponse.json({ articles: rows });
  } catch (error: any) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
