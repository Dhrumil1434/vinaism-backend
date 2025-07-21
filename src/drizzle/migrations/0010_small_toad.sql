CREATE TABLE `contacts` (
	`contact_id` int AUTO_INCREMENT NOT NULL,
	`entity_type` enum('Worker','Client','Vendor','Supplier','Designer','User') NOT NULL,
	`entity_id` varchar(255) NOT NULL,
	`relation_to_entity` varchar(100),
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone_number` varchar(20) NOT NULL,
	`blood_group` varchar(10),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `contacts_contact_id` PRIMARY KEY(`contact_id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`supplier_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`category` varchar(100),
	`company_name` varchar(255) NOT NULL,
	`gst_number` varchar(15) NOT NULL,
	`pan_card_number` varchar(10) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `suppliers_supplier_id` PRIMARY KEY(`supplier_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_orders` (
	`vendor_order_id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`vendor_id` int NOT NULL,
	`created_by_user_id` int NOT NULL,
	`onsite_person_contact_id` int,
	`authentication_status` enum('Pending','Approved','Rejected') NOT NULL,
	`approved_by_user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`return_form_id` int,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `vendor_orders_vendor_order_id` PRIMARY KEY(`vendor_order_id`)
);
--> statement-breakpoint
CREATE TABLE `workers` (
	`worker_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`mobile_number` varchar(20) NOT NULL,
	`adhaar_number` varchar(12) NOT NULL,
	`dob` date NOT NULL,
	`picture_url` varchar(500),
	`worker_type` enum('Vendor Employed','Internal','Freelance','On-site Coordinator') NOT NULL,
	`vendor_id` int,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `workers_worker_id` PRIMARY KEY(`worker_id`),
	CONSTRAINT `workers_adhaar_number_unique` UNIQUE(`adhaar_number`)
);
--> statement-breakpoint
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_vendor_id_vendors_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_created_by_user_id_users_user_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_onsite_person_contact_id_contacts_contact_id_fk` FOREIGN KEY (`onsite_person_contact_id`) REFERENCES `contacts`(`contact_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_approved_by_user_id_users_user_id_fk` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workers` ADD CONSTRAINT `workers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workers` ADD CONSTRAINT `workers_vendor_id_vendors_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE set null ON UPDATE no action;