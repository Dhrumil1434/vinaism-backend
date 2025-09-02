CREATE TABLE `entity_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(255),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_entity_types_name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `address_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(255),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `address_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_address_types_name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `addresses_link` (
	`address_link_id` int AUTO_INCREMENT NOT NULL,
	`address_id` int NOT NULL,
	`entity_id` varchar(255) NOT NULL,
	`entity_type_id` int NOT NULL,
	`address_type_id` int NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_link_address_link_id` PRIMARY KEY(`address_link_id`),
	CONSTRAINT `uq_addresses_link_unique` UNIQUE(`address_id`,`entity_id`,`entity_type_id`,`address_type_id`)
);
--> statement-breakpoint
ALTER TABLE `addresses` ADD `entity_type_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` ADD `address_type_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses_link` ADD CONSTRAINT `addresses_link_address_id_addresses_address_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`address_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `addresses_link` ADD CONSTRAINT `addresses_link_entity_type_id_entity_types_id_fk` FOREIGN KEY (`entity_type_id`) REFERENCES `entity_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `addresses_link` ADD CONSTRAINT `addresses_link_address_type_id_address_types_id_fk` FOREIGN KEY (`address_type_id`) REFERENCES `address_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_addresses_link_entity` ON `addresses_link` (`entity_id`,`entity_type_id`);--> statement-breakpoint
CREATE INDEX `idx_addresses_link_address` ON `addresses_link` (`address_id`);--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_entity_type_id_entity_types_id_fk` FOREIGN KEY (`entity_type_id`) REFERENCES `entity_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_address_type_id_address_types_id_fk` FOREIGN KEY (`address_type_id`) REFERENCES `address_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `entity_type`;--> statement-breakpoint
ALTER TABLE `addresses` DROP COLUMN `address_type`;