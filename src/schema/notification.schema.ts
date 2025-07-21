import {
  mysqlTable,
  int,
  text,
  boolean,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';

export const notifications = mysqlTable('notifications', {
  notificationId: int('notification_id').autoincrement().primaryKey(),
  userId: int('user_id')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  message: text('message').notNull(),
  notificationType: mysqlEnum('notification_type', [
    'System',
    'Task',
    'Approval',
    'Alert',
  ]).notNull(),
  isRead: boolean('is_read').notNull().default(false),
  ...timestamps,
});
