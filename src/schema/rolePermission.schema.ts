import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { permission } from './permission.schema';
import { timestamps } from './helpers/column.helpers';

export const rolePermission = mysqlTable('role_permissions', {
  roleId: int('role_id').autoincrement().primaryKey(),
  permissionId: int('permission_id')
    .references(() => permission.permissionId)
    .primaryKey(),
  ...timestamps,
});
