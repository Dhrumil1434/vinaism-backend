import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const userTypes = mysqlTable('user_types', {
  userTypeId: varchar('user_type_id', { length: 36 }).primaryKey(),
  typeName: varchar('type_name', { length: 100 }).unique(), // e.g., 'Client', 'Vendor'
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  ...timestamps,
});
