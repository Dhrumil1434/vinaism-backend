CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`email` varchar(255),
	`first_name` varchar(150) NOT NULL,
	`last_name` varchar(150) NOT NULL,
	`password` varchar(255),
	`user_type_id` varchar(36),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_phone_number_unique` UNIQUE(`phone_number`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `user_types` (
	`user_type_id` varchar(36) NOT NULL,
	`type_name` varchar(100),
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`is_active` boolean DEFAULT true,
	`deleted_at` timestamp,
	CONSTRAINT `user_types_user_type_id` PRIMARY KEY(`user_type_id`),
	CONSTRAINT `user_types_type_name_unique` UNIQUE(`type_name`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_user_types_user_type_id_fk` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`user_type_id`) ON DELETE no action ON UPDATE no action;