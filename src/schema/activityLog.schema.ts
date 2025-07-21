import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';

export const activityLogs = mysqlTable('activity_logs', {
  logId: int('log_id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.userId, {
    onDelete: 'set null',
  }),
  actionType: mysqlEnum('action_type', [
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'APPROVAL',
  ]).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }), // Remains varchar for polymorphic reference
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv4 or IPv6
  actionTimestamp: timestamps.created_at, // Using createdAt for action_timestamp
  ...timestamps, // Has its own createdAt/updatedAt
});
