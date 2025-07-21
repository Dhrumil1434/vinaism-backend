import { boolean, timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
  is_active: boolean().default(true),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
