CREATE TABLE `oauth_metadata` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  `provider_email` varchar(255),
  `provider_name` varchar(255),
  `provider_picture` text,
  `access_token` text,
  `refresh_token` text,
  `token_expires_at` timestamp,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `oauth_metadata_id` PRIMARY KEY(`id`),
  CONSTRAINT `oauth_provider_user_idx` UNIQUE(`provider`,`provider_user_id`)
); 