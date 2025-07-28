import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { users } from './user.schema';

export const loginSessions = mysqlTable('login_sessions', {
  sessionId: int('session_id').autoincrement().primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  refreshToken: varchar('refresh_token', { length: 500 }).notNull(),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});
