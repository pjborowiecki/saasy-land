CREATE TYPE "public"."license_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."license_tier" AS ENUM('core', 'complete');--> statement-breakpoint
CREATE TABLE "license" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"key" varchar(128),
	"polar_customer_id" varchar(64) NOT NULL,
	"polar_license_key_id" varchar(64),
	"polar_order_id" varchar(64),
	"status" "license_status" DEFAULT 'active' NOT NULL,
	"tier" "license_tier" NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "license_key_unique" UNIQUE("key"),
	CONSTRAINT "license_polar_license_key_id_unique" UNIQUE("polar_license_key_id"),
	CONSTRAINT "license_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "license" ADD CONSTRAINT "license_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "license_status_tier_idx" ON "license" USING btree ("status","tier");