CREATE TYPE "public"."newsletter_locale" AS ENUM('en-US', 'pl-PL');--> statement-breakpoint
CREATE TYPE "public"."newsletter_source" AS ENUM('footer', 'blog', 'app');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('subscribed', 'unsubscribed');--> statement-breakpoint
CREATE TABLE "newsletter_subscriber" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"locale" "newsletter_locale" DEFAULT 'en-US' NOT NULL,
	"source" "newsletter_source" DEFAULT 'footer' NOT NULL,
	"status" "newsletter_status" DEFAULT 'subscribed' NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribe_token" varchar(64) NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscriber_email_unique" UNIQUE("email"),
	CONSTRAINT "newsletter_subscriber_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE INDEX "newsletter_subscriber_status_locale_idx" ON "newsletter_subscriber" USING btree ("status","locale");