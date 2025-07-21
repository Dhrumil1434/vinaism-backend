import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers'; // Assuming this helper provides createdAt and updatedAt
import { users } from './user.schema'; // Assuming your users schema is in user.schema.ts
import { vendorCategories } from './vendorCategory.schema';

export const vendors = mysqlTable('vendors', {
  vendorId: varchar('vendor_id', { length: 255 }).notNull().primaryKey(), // Primary Key
  userId: varchar('user_id', { length: 255 }).references(() => users.userId, {
    onDelete: 'set null',
  }),
  category: varchar('category', { length: 100 })
    .notNull()
    .references(() => vendorCategories.categoryId), // e.g., 'Electrical', 'Plumbing', 'Civil', 'Other'
  companyName: varchar('company_name', { length: 255 }).notNull(),
  gstNumber: varchar('gst_number', { length: 15 }).notNull(), // Typical GSTIN is 15 chars
  panCardNumber: varchar('pan_card_number', { length: 10 }).notNull(), // PAN is typically 10 chars (alphanumeric)
  ...timestamps, // Includes createdAt and updatedAt columns
});
