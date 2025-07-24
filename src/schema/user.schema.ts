import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { userTypes } from './userTypes.schema';
import { timestamps } from './helpers/column.helpers';

export const users = mysqlTable('users', {
  userId: int('user_id').autoincrement().notNull().primaryKey(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  profilePicture: varchar('profile_picture', { length: 200 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 150 }).notNull(),
  lastName: varchar('last_name', { length: 150 }).notNull(),
  password: varchar('password', { length: 255 }),
  userType: int('user_type_id').references(() => userTypes.userTypeId),
  ...timestamps,
});
