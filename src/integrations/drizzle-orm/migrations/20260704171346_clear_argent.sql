DROP INDEX "user_email_idx";--> statement-breakpoint
CREATE INDEX "user_role_createdAt_idx" ON "user" USING btree ("role","created_at");