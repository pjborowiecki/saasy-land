CREATE INDEX "category_createdAt_idx" ON "category" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_createdAt_idx" ON "product" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_anonymous";