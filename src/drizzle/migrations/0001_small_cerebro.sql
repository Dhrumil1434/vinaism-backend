CREATE TABLE `roles` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`role_name` varchar(150) NOT NULL,
	`role_description` varchar(150),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `roles_role_id` PRIMARY KEY(`role_id`),
	CONSTRAINT `roles_role_name_unique` UNIQUE(`role_name`)
);
