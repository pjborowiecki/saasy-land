CREATE INDEX `rate_limit_expires_at_idx` ON `rate_limit` (`expires_at`);--> statement-breakpoint
CREATE INDEX `auth_rate_limit_last_request_idx` ON `auth_rate_limit` (`last_request`);