// src/schema/address.schema.ts
import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './helpers/column.helpers'; // Make sure this path is correct
import { entityTypes } from './entityType.schema';
import { addressTypes } from './addressType.schema';

export const addresses = mysqlTable('addresses', {
  addressId: int('address_id').autoincrement().primaryKey(), // OR varchar('address_id', { length: 255 }).notNull().primaryKey() if you intended string PK
  entityTypeId: int('entity_type_id')
    .notNull()
    .references(() => entityTypes.id),
  entityId: varchar('entity_id', { length: 255 }).notNull(),
  addressTypeId: int('address_type_id')
    .notNull()
    .references(() => addressTypes.id),
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true), // Explicitly define if not in helper, or ensure helper is used.
  ...timestamps, // Spreads createdAt, updatedAt, deletedAt
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  entityType: one(entityTypes, {
    fields: [addresses.entityTypeId],
    references: [entityTypes.id],
  }),
  addressType: one(addressTypes, {
    fields: [addresses.addressTypeId],
    references: [addressTypes.id],
  }),
}));
