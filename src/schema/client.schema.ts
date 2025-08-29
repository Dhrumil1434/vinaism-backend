import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';

export const client = mysqlTable('clients', {
  clientId: int('client_id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.userId),
  gstNumber: varchar('gst_number', { length: 150 }).notNull(),
  billingFirmName: varchar('billing_firm_name', { length: 150 }).notNull(),
  officeMobileNumber: varchar('office_mobile_number', { length: 20 }).notNull(),
  companyLogo: varchar('company_logo', { length: 200 }),
  ...timestamps,
});
