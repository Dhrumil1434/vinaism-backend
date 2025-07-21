import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const permission = mysqlTable('permissions', {
  permissionId: int('permission_id').autoincrement().primaryKey(),
  permissionName: varchar('permission_name', { length: 30 }).notNull().unique(),
  permissionDescription: varchar('permission_description', {
    length: 250,
  }),
  ...timestamps,
});
