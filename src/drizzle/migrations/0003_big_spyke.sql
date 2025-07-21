CREATE TABLE `permissions` (
	`permission_id` int AUTO_INCREMENT NOT NULL,
	`permission_name` varchar(30) NOT NULL,
	`permission_description` varchar(250),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `permissions_permission_id` PRIMARY KEY(`permission_id`),
	CONSTRAINT `permissions_permission_name_unique` UNIQUE(`permission_name`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`permission_id` varchar(255) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `role_permissions_role_id` PRIMARY KEY(`role_id`)
);
--> statement-breakpoint
ALTER TABLE `user_types` MODIFY COLUMN `user_type_id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_permission_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`permission_id`) ON DELETE no action ON UPDATE no action;