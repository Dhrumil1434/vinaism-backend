// src/schema/address.schema.ts
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  boolean,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers'; // Make sure this path is correct

export const addresses = mysqlTable('addresses', {
  addressId: int('address_id').autoincrement().primaryKey(), // OR varchar('address_id', { length: 255 }).notNull().primaryKey() if you intended string PK
  entityType: mysqlEnum('entity_type', [
    'Client',
    'Vendor',
    'Supplier',
    'Designer',
    'Worker',
    'Project',
    'Office',
  ]).notNull(),
  entityId: varchar('entity_id', { length: 255 }).notNull(),
  addressType: mysqlEnum('address_type', [
    'Office',
    'Factory',
    'Warehouse',
    'Shop',
    'Studio',
    'Billing',
    'Project',
    'Residential',
    'Other',
  ]).notNull(),
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true), // Explicitly define if not in helper, or ensure helper is used.
  ...timestamps, // Spreads createdAt, updatedAt, deletedAt
});
