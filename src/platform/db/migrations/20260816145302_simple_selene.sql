ALTER TABLE "newsletter_subscriber" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TYPE "public"."newsletter_status" RENAME TO "newsletter_status_old";--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('subscribed', 'unsubscribed', 'pending');--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ALTER COLUMN "status" SET DATA TYPE "public"."newsletter_status" USING "status"::text::"public"."newsletter_status";--> statement-breakpoint
DROP TYPE "public"."newsletter_status_old";--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ALTER COLUMN "subscribed_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ALTER COLUMN "subscribed_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ADD COLUMN "confirmation_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ADD COLUMN "confirmation_token" varchar(64);--> statement-breakpoint
ALTER TABLE "newsletter_subscriber" ADD CONSTRAINT "newsletter_subscriber_confirmation_token_unique" UNIQUE("confirmation_token");
