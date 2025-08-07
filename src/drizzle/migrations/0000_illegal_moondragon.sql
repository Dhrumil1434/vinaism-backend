CREATE TABLE `user_types` (
	`user_type_id` int AUTO_INCREMENT NOT NULL,
	`type_name` varchar(100),
	`description` varchar(255),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_types_user_type_id` PRIMARY KEY(`user_type_id`),
	CONSTRAINT `user_types_type_name_unique` UNIQUE(`type_name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`profile_picture` varchar(200) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(150) NOT NULL,
	`last_name` varchar(150) NOT NULL,
	`password` varchar(255),
	`user_type_id` int,
	`email_verified` boolean NOT NULL DEFAULT false,
	`phone_verified` boolean NOT NULL DEFAULT false,
	`otp_code` varchar(6),
	`otp_expires_at` timestamp,
	`admin_approved` boolean NOT NULL DEFAULT false,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_phone_number_unique` UNIQUE(`phone_number`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`role_name` varchar(30) NOT NULL,
	`role_description` varchar(250) NOT NULL,
	CONSTRAINT `roles_role_id` PRIMARY KEY(`role_id`),
	CONSTRAINT `roles_role_name_unique` UNIQUE(`role_name`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`permission_id` int AUTO_INCREMENT NOT NULL,
	`permission_name` varchar(30) NOT NULL,
	`permission_description` varchar(250),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `permissions_permission_id` PRIMARY KEY(`permission_id`),
	CONSTRAINT `permissions_permission_name_unique` UNIQUE(`permission_name`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`permission_id` int NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `role_permissions_role_id` PRIMARY KEY(`role_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_categories` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(100) NOT NULL,
	`description` varchar(255),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_categories_category_id` PRIMARY KEY(`category_id`),
	CONSTRAINT `vendor_categories_category_name_unique` UNIQUE(`category_name`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`vendor_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`category` int NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`gst_number` varchar(15) NOT NULL,
	`pan_card_number` varchar(10) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_vendor_id` PRIMARY KEY(`vendor_id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`client_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`gst_number` varchar(150) NOT NULL,
	`billing_firm_name` varchar(150) NOT NULL,
	`office_mobile_number` varchar(20) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_client_id` PRIMARY KEY(`client_id`)
);
--> statement-breakpoint
CREATE TABLE `designers` (
	`designer_id` varchar(255) NOT NULL,
	`user_id` int,
	`category` varchar(100),
	`company_name` varchar(255),
	`gst_number` varchar(15),
	`pan_card_number` varchar(10),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designers_designer_id` PRIMARY KEY(`designer_id`)
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
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_supplier_id` PRIMARY KEY(`supplier_id`)
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`address_id` int AUTO_INCREMENT NOT NULL,
	`entity_type` enum('Client','Vendor','Supplier','Designer','Worker','Project','Office') NOT NULL,
	`entity_id` varchar(255) NOT NULL,
	`address_type` enum('Office','Factory','Warehouse','Shop','Studio','Billing','Project','Residential','Other') NOT NULL,
	`address_line_1` varchar(255) NOT NULL,
	`address_line_2` varchar(255),
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`pincode` varchar(10) NOT NULL,
	`country` varchar(100) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_address_id` PRIMARY KEY(`address_id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`project_id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`project_name` varchar(255) NOT NULL,
	`project_type` enum('Product Design','Space Design','Other') NOT NULL,
	`noc_letter_url` varchar(500),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_project_id` PRIMARY KEY(`project_id`)
);
--> statement-breakpoint
CREATE TABLE `project_space_details` (
	`project_id` int NOT NULL,
	`project_sqft` decimal(10,2) NOT NULL,
	`project_category` varchar(100) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_space_details_project_id` PRIMARY KEY(`project_id`)
);
--> statement-breakpoint
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
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_contact_id` PRIMARY KEY(`contact_id`)
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
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workers_worker_id` PRIMARY KEY(`worker_id`),
	CONSTRAINT `workers_adhaar_number_unique` UNIQUE(`adhaar_number`)
);
--> statement-breakpoint
CREATE TABLE `id_cards` (
	`card_id` int AUTO_INCREMENT NOT NULL,
	`worker_id` int NOT NULL,
	`project_id` int NOT NULL,
	`card_number` varchar(255) NOT NULL,
	`issue_date` date NOT NULL,
	`valid_from` date NOT NULL,
	`valid_to` date NOT NULL,
	`status` enum('Active','Expired','Revoked') NOT NULL,
	`location_tracking_enabled` boolean NOT NULL DEFAULT false,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `id_cards_card_id` PRIMARY KEY(`card_id`),
	CONSTRAINT `id_cards_card_number_unique` UNIQUE(`card_number`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` int NOT NULL,
	`role_id` int NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_roles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `activity_logs` (
	`log_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`action_type` enum('CREATE','READ','UPDATE','DELETE','LOGIN','LOGOUT','APPROVAL') NOT NULL,
	`resource_type` varchar(100) NOT NULL,
	`resource_id` varchar(255),
	`details` text,
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `activity_logs_log_id` PRIMARY KEY(`log_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`notification_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message` text NOT NULL,
	`notification_type` enum('System','Task','Approval','Alert') NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `task_assignments` (
	`task_id` int AUTO_INCREMENT NOT NULL,
	`worker_id` int NOT NULL,
	`project_id` int NOT NULL,
	`assigned_by_user_id` int NOT NULL,
	`task_description` text NOT NULL,
	`status` enum('Not Started','In Progress','Completed','Delayed','Cancelled') NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `task_assignments_task_id` PRIMARY KEY(`task_id`)
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
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`return_form_id` int,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_orders_vendor_order_id` PRIMARY KEY(`vendor_order_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_order_items` (
	`order_item_id` int AUTO_INCREMENT NOT NULL,
	`vendor_order_id` int,
	`material_product_name` varchar(255) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit_price` decimal(10,2),
	`total_price` decimal(10,2),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_order_items_order_item_id` PRIMARY KEY(`order_item_id`)
);
--> statement-breakpoint
CREATE TABLE `price_forms` (
	`price_form_id` int AUTO_INCREMENT NOT NULL,
	`vendor_order_id` int NOT NULL,
	`supplier_id` int NOT NULL,
	`quotation_number` varchar(100) NOT NULL,
	`total_amount` decimal(12,2) NOT NULL,
	`tax_amount` decimal(12,2) NOT NULL,
	`final_amount` decimal(12,2) NOT NULL,
	`validity_date` date NOT NULL,
	`status` enum('Draft','Submitted','Approved','Rejected') NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `price_forms_price_form_id` PRIMARY KEY(`price_form_id`)
);
--> statement-breakpoint
CREATE TABLE `time_logs` (
	`log_id` int AUTO_INCREMENT NOT NULL,
	`task_id` int NOT NULL,
	`worker_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`hours_worked` decimal(5,2) NOT NULL,
	`notes` text,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `time_logs_log_id` PRIMARY KEY(`log_id`)
);
--> statement-breakpoint
CREATE TABLE `login_sessions` (
	`session_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`refresh_token` varchar(500) NOT NULL,
	`is_active` boolean DEFAULT true,
	`expires_at` timestamp NOT NULL,
	`user_agent` varchar(500),
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `login_sessions_session_id` PRIMARY KEY(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`attempt_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`attempt_count` int DEFAULT 0,
	`is_locked` boolean DEFAULT false,
	`lockout_until` timestamp,
	`last_attempt_at` timestamp DEFAULT (now()),
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `login_attempts_attempt_id` PRIMARY KEY(`attempt_id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_user_types_user_type_id_fk` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`user_type_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_permission_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`permission_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendors` ADD CONSTRAINT `vendors_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendors` ADD CONSTRAINT `vendors_category_vendor_categories_category_id_fk` FOREIGN KEY (`category`) REFERENCES `vendor_categories`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `designers` ADD CONSTRAINT `designers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_client_id_clients_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`client_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_space_details` ADD CONSTRAINT `project_space_details_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workers` ADD CONSTRAINT `workers_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workers` ADD CONSTRAINT `workers_vendor_id_vendors_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `id_cards` ADD CONSTRAINT `id_cards_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `id_cards` ADD CONSTRAINT `id_cards_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_assigned_by_user_id_users_user_id_fk` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_vendor_id_vendors_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_created_by_user_id_users_user_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_onsite_person_contact_id_contacts_contact_id_fk` FOREIGN KEY (`onsite_person_contact_id`) REFERENCES `contacts`(`contact_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_orders` ADD CONSTRAINT `vendor_orders_approved_by_user_id_users_user_id_fk` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_order_items` ADD CONSTRAINT `vendor_order_items_vendor_order_id_vendor_orders_vendor_order_id_fk` FOREIGN KEY (`vendor_order_id`) REFERENCES `vendor_orders`(`vendor_order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `price_forms` ADD CONSTRAINT `price_forms_vendor_order_id_vendor_orders_vendor_order_id_fk` FOREIGN KEY (`vendor_order_id`) REFERENCES `vendor_orders`(`vendor_order_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `price_forms` ADD CONSTRAINT `price_forms_supplier_id_suppliers_supplier_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_logs` ADD CONSTRAINT `time_logs_task_id_task_assignments_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task_assignments`(`task_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_logs` ADD CONSTRAINT `time_logs_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `login_sessions` ADD CONSTRAINT `login_sessions_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `login_attempts` ADD CONSTRAINT `login_attempts_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;