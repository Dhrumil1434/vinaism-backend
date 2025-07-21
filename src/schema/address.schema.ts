import { mysqlTable, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const addresses = mysqlTable('addresses', {
  addressId: varchar('address_id', { length: 255 }).notNull().primaryKey(),
  // Polymorphic association fields
  entityType: mysqlEnum('entity_type', [
    'client',
    'vendor',
    'supplier',
    'designer',
    'worker',
    'project',
    'office',
  ]).notNull(),
  entityId: varchar('entity_id', { length: 255 }).notNull(), // This will store the client_id, vendor_id, etc.

  addressType: mysqlEnum('address_type', [
    'office',
    'factory',
    'warehouse',
    'shop',
    'studio',
    'billing',
    'project',
    'residential',
    'other',
  ]).notNull(),
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  ...timestamps,
});
