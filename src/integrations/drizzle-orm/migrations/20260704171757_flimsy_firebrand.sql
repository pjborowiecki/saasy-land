DROP INDEX "verification_identifier_idx";--> statement-breakpoint
CREATE INDEX "verification_expiresAt_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_createdAt_idx" ON "verification" USING btree ("identifier","created_at");