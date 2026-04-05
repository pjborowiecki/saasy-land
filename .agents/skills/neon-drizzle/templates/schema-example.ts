/**
 * Drizzle Schema Example
 *
 * This file demonstrates how to define database tables and relationships
 * using Drizzle ORM with Neon Postgres.
 *
 * Usage: Import these tables in your application code for type-safe queries
 */

import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  decimal,
  json,
  index,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users Table
 *
 * Stores basic user information. Can be extended with additional fields
 * as needed by your application.
 */
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    password: text("password"), // If not using external auth
    avatar: text("avatar"), // URL to avatar image
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  }),
);

/**
 * Profiles Table
 *
 * Extended user information. Uses a foreign key to link with users.
 */
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Posts Table
 *
 * Blog posts created by users.
 */
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    published: boolean("published").default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("posts_user_id_idx").on(table.userId),
    publishedIdx: index("posts_published_idx").on(table.published),
    slugIdx: index("posts_slug_idx").on(table.slug),
  }),
);

/**
 * Comments Table
 *
 * Comments on blog posts. Supports nested comments via parent_id.
 */
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: integer("parent_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    approved: boolean("approved").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    postIdIdx: index("comments_post_id_idx").on(table.postId),
    userIdIdx: index("comments_user_id_idx").on(table.userId),
    parentIdIdx: index("comments_parent_id_idx").on(table.parentId),
  }),
);

/**
 * Tags Table
 *
 * Tags for categorizing posts.
 */
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * PostTags Junction Table
 *
 * Many-to-many relationship between posts and tags.
 */
export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: { name: "post_tags_pk", columns: [table.postId, table.tagId] },
    postIdIdx: index("post_tags_post_id_idx").on(table.postId),
    tagIdIdx: index("post_tags_tag_id_idx").on(table.tagId),
  }),
);

/**
 * Settings Table
 *
 * Application-wide or user-specific settings stored as JSON.
 */
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }), // null = global settings
  key: varchar("key", { length: 255 }).notNull(),
  value: json("value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Relations (optional but recommended for better type safety)
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  posts: many(posts),
  comments: many(comments),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(postTags),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));
