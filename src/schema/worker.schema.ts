import {
  mysqlTable,
  int,
  varchar,
  date,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';
import { vendors } from './vendor.schema';

export const workers = mysqlTable('workers', {
  workerId: int('worker_id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.userId, {
    onDelete: 'set null',
  }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  mobileNumber: varchar('mobile_number', { length: 20 }).notNull(),
  adhaarNumber: varchar('adhaar_number', { length: 12 }).notNull().unique(),
  dob: date('dob', { mode: 'string' }).notNull(),
  pictureUrl: varchar('picture_url', { length: 500 }),
  workerType: mysqlEnum('worker_type', [
    'Vendor Employed',
    'Internal',
    'Freelance',
    'On-site Coordinator',
  ]).notNull(),
  vendorId: int('vendor_id').references(() => vendors.vendorId, {
    onDelete: 'set null',
  }),
  ...timestamps,
});
