import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers'; // Assuming this helper provides createdAt and updatedAt
import { users } from './user.schema'; // Assuming your users schema is in user.schema.ts

export const designers = mysqlTable('designers', {
  designerId: varchar('designer_id', { length: 255 }).notNull().primaryKey(), // Primary Key (string/UUID as per ER)
  userId: int('user_id').references(() => users.userId, {
    onDelete: 'set null',
  }), // Foreign Key to users, nullable
  category: varchar('category', { length: 100 }), // e.g., 'Interior', 'Architectural', 'Landscape'. Nullable as per ER implicit nullable for category
  companyName: varchar('company_name', { length: 255 }),
  gstNumber: varchar('gst_number', { length: 15 }), // Typical GSTIN is 15 chars
  panCardNumber: varchar('pan_card_number', { length: 10 }), // PAN is typically 10 chars (alphanumeric)
  ...timestamps, // Includes createdAt and updatedAt columns
});
