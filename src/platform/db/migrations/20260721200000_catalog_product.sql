CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('one_time', 'subscription', 'course');--> statement-breakpoint
CREATE TABLE "product" (
	"billing_cycle" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"type" "product_type" DEFAULT 'one_time' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
