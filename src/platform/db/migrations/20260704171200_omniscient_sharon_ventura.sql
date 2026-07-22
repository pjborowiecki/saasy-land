CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_createdAt_idx" ON "user" USING btree ("created_at");