CREATE TABLE `login_sessions` (
	`session_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`refresh_token` varchar(500) NOT NULL,
	`is_active` boolean DEFAULT true,
	`expires_at` timestamp NOT NULL,
	`user_agent` varchar(500),
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `login_sessions_session_id` PRIMARY KEY(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`attempt_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`attempt_count` int DEFAULT 0,
	`is_locked` boolean DEFAULT false,
	`lockout_until` timestamp,
	`last_attempt_at` timestamp,
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `login_attempts_attempt_id` PRIMARY KEY(`attempt_id`)
);
