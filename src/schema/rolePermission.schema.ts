import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { permission } from './permission.schema';
import { timestamps } from './helpers/column.helpers';

export const rolePermission = mysqlTable('role_permissions', {
  roleId: int('role_id').autoincrement().primaryKey(),
  permissionId: varchar('permission_id', { length: 255 })
    .references(() => permission.permissionId)
    .primaryKey(),
  ...timestamps,
});
