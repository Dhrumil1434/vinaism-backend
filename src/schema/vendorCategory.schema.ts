import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers'; // Assuming this helper provides createdAt and updatedAt
// --- New Schema: vendor_categories ---
// This table will store unique vendor categories (e.g., 'Electrical', 'Plumbing')
export const vendorCategories = mysqlTable('vendor_categories', {
  categoryId: int('category_id').autoincrement().primaryKey(), // Auto-incrementing integer PK
  categoryName: varchar('category_name', { length: 100 }).notNull().unique(), // e.g., 'Electrical', 'Plumbing', unique and not null
  description: varchar('description', { length: 255 }), // Optional: A more detailed description of the category
  ...timestamps, // Includes createdAt and updatedAt columns
});
