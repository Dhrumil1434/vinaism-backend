import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { users } from './user.schema';

export const loginAttempts = mysqlTable('login_attempts', {
  attemptId: int('attempt_id').autoincrement().primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  attemptCount: int('attempt_count').default(0),
  isLocked: boolean('is_locked').default(false),
  lockoutUntil: timestamp('lockout_until', { mode: 'string' }),
  lastAttemptAt: timestamp('last_attempt_at', { mode: 'string' }).defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});
