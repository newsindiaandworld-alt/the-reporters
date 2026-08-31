import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  dispatchType: text("dispatch_type").notNull().default("Article"),
  imageUrl: text("image_url"),
  mediaType: text("media_type", { enum: ["image", "video"] }).notNull().default("image"),
  status: text("status", { enum: ["pending", "published", "rejected"] })
    .notNull()
    .default("pending"),
  reporterName: text("reporter_name"),
  authorId: text("author_id").notNull().default(""),
  location: text("location"),
  category: text("category").notNull().default("General"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const likes = sqliteTable(
  "likes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    articleId: integer("article_id").notNull(),
  },
  (table) => ({
    userArticleUnique: uniqueIndex("likes_user_article_unique").on(
      table.userId,
      table.articleId
    ),
  })
);

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    articleId: integer("article_id").notNull(),
  },
  (table) => ({
    userArticleUnique: uniqueIndex("bookmarks_user_article_unique").on(
      table.userId,
      table.articleId
    ),
  })
);

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// --- Auth.js (NextAuth v5) tables --------------------------------------
// Standard Auth.js Drizzle-adapter shape, plus a `password` column on
// `users` for the Credentials (email/password) provider. OAuth-only users
// (e.g. Google) will have `password` left null.

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
  avatarUrl: text("avatar_url"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);
