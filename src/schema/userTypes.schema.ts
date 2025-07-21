import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const userTypes = mysqlTable('user_types', {
  userTypeId: int('user_type_id').autoincrement().primaryKey(),
  typeName: varchar('type_name', { length: 100 }).unique(), // e.g., 'Client', 'Vendor'
  description: varchar('description', { length: 255 }),
  ...timestamps,
});
