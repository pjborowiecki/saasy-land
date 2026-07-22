DROP INDEX "session_userId_idx";--> statement-breakpoint
CREATE INDEX "session_expiresAt_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "session_userId_createdAt_idx" ON "session" USING btree ("user_id","created_at");