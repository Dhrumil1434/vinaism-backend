import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { users } from './user.schema';

export const suppliers = mysqlTable('suppliers', {
  supplierId: int('supplier_id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.userId, {
    onDelete: 'set null',
  }),
  category: varchar('category', { length: 100 }), // Still varchar as no supplier_categories table requested
  companyName: varchar('company_name', { length: 255 }).notNull(),
  gstNumber: varchar('gst_number', { length: 15 }).notNull(),
  panCardNumber: varchar('pan_card_number', { length: 10 }).notNull(),
  ...timestamps,
});
