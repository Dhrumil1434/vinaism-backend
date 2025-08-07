ALTER TABLE `oauth_metadata` ADD CONSTRAINT `oauth_metadata_user_id_users_user_id_fk` 
FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 