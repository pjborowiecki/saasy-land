CREATE TABLE `account` (
	`access_token` text(16384),
	`access_token_expires_at` integer,
	`account_id` text(1024) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`id_token` text(16384),
	`password` text(1024),
	`provider_id` text(128) NOT NULL,
	`refresh_token` text(16384),
	`refresh_token_expires_at` integer,
	`scope` text(8192),
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_providerId_idx` ON `account` (`user_id`,`provider_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_providerId_accountId_uidx` ON `account` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE TABLE `category` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT 'FolderOpen' NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`kind` text DEFAULT 'category' NOT NULL,
	`name` text(255) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `category_createdAt_idx` ON `category` (`created_at`);--> statement-breakpoint
CREATE TABLE `license` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`key` text(128),
	`polar_customer_id` text(64) NOT NULL,
	`polar_license_key_id` text(64),
	`polar_order_id` text(64),
	`status` text DEFAULT 'active' NOT NULL,
	`tier` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `license_key_unique` ON `license` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `license_polar_license_key_id_unique` ON `license` (`polar_license_key_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `license_user_id_unique` ON `license` (`user_id`);--> statement-breakpoint
CREATE INDEX `license_status_tier_idx` ON `license` (`status`,`tier`);--> statement-breakpoint
CREATE TABLE `newsletter_subscriber` (
	`confirmation_expires_at` integer,
	`confirmation_token` text(64),
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`email` text(255) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`locale` text DEFAULT 'en-US' NOT NULL,
	`source` text DEFAULT 'footer' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`subscribed_at` integer,
	`unsubscribe_token` text(64) NOT NULL,
	`unsubscribed_at` integer,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscriber_confirmation_token_unique` ON `newsletter_subscriber` (`confirmation_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscriber_email_unique` ON `newsletter_subscriber` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscriber_unsubscribe_token_unique` ON `newsletter_subscriber` (`unsubscribe_token`);--> statement-breakpoint
CREATE INDEX `newsletter_subscriber_status_locale_idx` ON `newsletter_subscriber` (`status`,`locale`);--> statement-breakpoint
CREATE TABLE `product` (
	`billing_cycle` text(32),
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`currency` text(3) DEFAULT 'USD' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`price_cents` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`type` text DEFAULT 'one_time' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `product_createdAt_idx` ON `product` (`created_at`);--> statement-breakpoint
CREATE TABLE `session` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`impersonated_by` text,
	`ip_address` text(45),
	`token` text(16384) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`user_agent` text(4096),
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_expiresAt_idx` ON `session` (`expires_at`);--> statement-breakpoint
CREATE INDEX `session_userId_createdAt_idx` ON `session` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `two_factor` (
	`backup_codes` text(8192) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`failed_verification_count` integer DEFAULT 0 NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`locked_until` integer,
	`secret` text(1024) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`user_id` text NOT NULL,
	`verified` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `twoFactor_userId_uidx` ON `two_factor` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`ban_expires` integer,
	`ban_reason` text(255),
	`banned` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`email` text(64) NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image` text(2048),
	`name` text(32) NOT NULL,
	`role` text DEFAULT 'customer' NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`two_factor_enabled` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_createdAt_idx` ON `user` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_role_createdAt_idx` ON `user` (`role`,`created_at`);--> statement-breakpoint
CREATE TABLE `verification` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text(512) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`value` text(8192) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_expiresAt_idx` ON `verification` (`expires_at`);--> statement-breakpoint
CREATE INDEX `verification_identifier_createdAt_idx` ON `verification` (`identifier`,`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limit` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_rate_limit` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`count` integer NOT NULL,
	`last_request` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_rate_limit_key_unique` ON `auth_rate_limit` (`key`);