DROP INDEX "twoFactor_userId_idx";--> statement-breakpoint
DROP INDEX "twoFactor_secret_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "twoFactor_userId_uidx" ON "two_factor" USING btree ("user_id");