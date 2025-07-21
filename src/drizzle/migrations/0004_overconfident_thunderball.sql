CREATE TABLE `addresses` (
	`address_id` varchar(255) NOT NULL,
	`entity_type` enum('client','vendor','supplier','designer','worker','project','office') NOT NULL,
	`entity_id` varchar(255) NOT NULL,
	`address_type` enum('office','factory','warehouse','shop','studio','billing','project','residential','other') NOT NULL,
	`address_line_1` varchar(255) NOT NULL,
	`address_line_2` varchar(255),
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`pincode` varchar(10) NOT NULL,
	`country` varchar(100) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `addresses_address_id` PRIMARY KEY(`address_id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`client_id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`gst_number` varchar(150) NOT NULL,
	`billing_firm_name` varchar(150) NOT NULL,
	`office_mobile_number` varchar(20) NOT NULL,
	`is_active` boolean DEFAULT true,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `clients_client_id` PRIMARY KEY(`client_id`)
);
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;