ALTER TABLE "session" ADD COLUMN "impersonated_by" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" varchar(32) DEFAULT 'customer' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp with time zone;