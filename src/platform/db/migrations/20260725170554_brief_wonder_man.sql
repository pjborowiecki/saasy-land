UPDATE "user" SET "timezone" = 'UTC' WHERE "timezone" IS NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "timezone" SET DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "timezone" SET NOT NULL;
