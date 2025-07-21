CREATE TABLE `user_roles` (
	`user_id` int NOT NULL,
	`role_id` int NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `user_roles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `role_name` varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `role_description` varchar(250) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `roles` DROP COLUMN `deleted_at`;