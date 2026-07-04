DROP INDEX "account_userId_idx";--> statement-breakpoint
CREATE INDEX "account_userId_providerId_idx" ON "account" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_providerId_accountId_uidx" ON "account" USING btree ("provider_id","account_id");