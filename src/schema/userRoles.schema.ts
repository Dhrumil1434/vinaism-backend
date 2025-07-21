import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';
import { role } from './roles.schema';
export const roles = mysqlTable('user_roles', {
  userId: int('user_id')
    .references(() => users.userId)
    .primaryKey(),
  roleId: int('role_id')
    .references(() => role.roleId)
    .primaryKey(),
  ...timestamps,
});
