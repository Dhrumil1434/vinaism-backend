CREATE TABLE `activity_logs` (
	`log_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`action_type` enum('CREATE','READ','UPDATE','DELETE','LOGIN','LOGOUT','APPROVAL') NOT NULL,
	`resource_type` varchar(100) NOT NULL,
	`resource_id` varchar(255),
	`details` text,
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `activity_logs_log_id` PRIMARY KEY(`log_id`)
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
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `id_cards_card_id` PRIMARY KEY(`card_id`),
	CONSTRAINT `id_cards_card_number_unique` UNIQUE(`card_number`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`notification_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message` text NOT NULL,
	`notification_type` enum('System','Task','Approval','Alert') NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
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
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `price_forms_price_form_id` PRIMARY KEY(`price_form_id`)
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
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `task_assignments_task_id` PRIMARY KEY(`task_id`)
);
--> statement-breakpoint
CREATE TABLE `time_logs` (
	`log_id` int AUTO_INCREMENT NOT NULL,
	`task_id` int NOT NULL,
	`worker_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`hours_worked` decimal(5,2) NOT NULL,
	`notes` text,
	`is_active` boolean DEFAULT true,
	`deleted_at` timestamp,
	CONSTRAINT `time_logs_log_id` PRIMARY KEY(`log_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_order_items` (
	`order_item_id` int AUTO_INCREMENT NOT NULL,
	`vendor_order_id` int NOT NULL,
	`material_product_name` varchar(255) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit_price` decimal(10,2),
	`total_price` decimal(10,2),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `vendor_order_items_order_item_id` PRIMARY KEY(`order_item_id`)
);
--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `id_cards` ADD CONSTRAINT `id_cards_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `id_cards` ADD CONSTRAINT `id_cards_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `price_forms` ADD CONSTRAINT `price_forms_vendor_order_id_vendor_orders_vendor_order_id_fk` FOREIGN KEY (`vendor_order_id`) REFERENCES `vendor_orders`(`vendor_order_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `price_forms` ADD CONSTRAINT `price_forms_supplier_id_suppliers_supplier_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_assignments` ADD CONSTRAINT `task_assignments_assigned_by_user_id_users_user_id_fk` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_logs` ADD CONSTRAINT `time_logs_task_id_task_assignments_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task_assignments`(`task_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `time_logs` ADD CONSTRAINT `time_logs_worker_id_workers_worker_id_fk` FOREIGN KEY (`worker_id`) REFERENCES `workers`(`worker_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_order_items` ADD CONSTRAINT `vendor_order_items_vendor_order_id_vendor_orders_vendor_order_id_fk` FOREIGN KEY (`vendor_order_id`) REFERENCES `vendor_orders`(`vendor_order_id`) ON DELETE cascade ON UPDATE no action;