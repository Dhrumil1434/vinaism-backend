import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const roles = mysqlTable('roles', {
  roleId: int('role_id').primaryKey().autoincrement(),
  roleName: varchar('role_name', { length: 150 }).notNull().unique(),
  roleDescription: varchar('role_description', { length: 150 }),
  ...timestamps,
});
