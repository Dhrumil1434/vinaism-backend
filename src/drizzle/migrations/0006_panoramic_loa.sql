CREATE TABLE `designers` (
	`designer_id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`category` varchar(100),
	`company_name` varchar(255),
	`gst_number` varchar(15),
	`pan_card_number` varchar(10),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `designers_designer_id` PRIMARY KEY(`designer_id`)
);
--> statement-breakpoint
ALTER TABLE `designers` ADD CONSTRAINT `designers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;