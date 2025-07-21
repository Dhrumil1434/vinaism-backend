CREATE TABLE `vendors` (
	`vendor_id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`category` varchar(100) NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`gst_number` varchar(15) NOT NULL,
	`pan_card_number` varchar(10) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `vendors_vendor_id` PRIMARY KEY(`vendor_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_categories` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(100) NOT NULL,
	`description` varchar(255),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `vendor_categories_category_id` PRIMARY KEY(`category_id`),
	CONSTRAINT `vendor_categories_category_name_unique` UNIQUE(`category_name`)
);
--> statement-breakpoint
ALTER TABLE `vendors` ADD CONSTRAINT `vendors_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendors` ADD CONSTRAINT `vendors_category_vendor_categories_category_id_fk` FOREIGN KEY (`category`) REFERENCES `vendor_categories`(`category_id`) ON DELETE no action ON UPDATE no action;