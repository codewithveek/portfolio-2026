CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`message` text NOT NULL,
	`ip_hash` text NOT NULL,
	`user_agent` text,
	`status` text DEFAULT 'received' NOT NULL,
	`error_code` text,
	`created_at` text NOT NULL
);
