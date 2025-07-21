CREATE TABLE `projects` (
	`project_id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`project_name` varchar(255) NOT NULL,
	`project_type` enum('Product Design','Space Design','Other') NOT NULL,
	`noc_letter_url` varchar(500),
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `projects_project_id` PRIMARY KEY(`project_id`)
);
--> statement-breakpoint
CREATE TABLE `project_space_details` (
	`project_id` int NOT NULL,
	`project_sqft` decimal(10,2) NOT NULL,
	`project_category` varchar(100) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `project_space_details_project_id` PRIMARY KEY(`project_id`)
);
--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_client_id_clients_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`client_id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_space_details` ADD CONSTRAINT `project_space_details_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE cascade ON UPDATE no action;