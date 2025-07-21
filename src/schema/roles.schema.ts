import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const role = mysqlTable('roles', {
  roleId: int('role_id').autoincrement().primaryKey(),
  roleName: varchar('role_name', { length: 30 }).notNull().unique(),
  roleDescription: varchar('role_description', { length: 250 }).notNull(),
});
