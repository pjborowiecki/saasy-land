CREATE TYPE "public"."category_icon" AS ENUM('Archive', 'FolderOpen', 'Puzzle');--> statement-breakpoint
CREATE TYPE "public"."category_kind" AS ENUM('category', 'collection');--> statement-breakpoint
CREATE TYPE "public"."category_visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
CREATE TABLE "category" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" "category_icon" DEFAULT 'FolderOpen' NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"kind" "category_kind" DEFAULT 'category' NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visibility" "category_visibility" DEFAULT 'public' NOT NULL
);
