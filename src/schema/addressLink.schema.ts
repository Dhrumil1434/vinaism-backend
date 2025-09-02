import {
  mysqlTable,
  int,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './helpers/column.helpers';
import { addresses } from './address.schema';
import { entityTypes } from './entityType.schema';
import { addressTypes } from './addressType.schema';

export const addressesLink = mysqlTable(
  'addresses_link',
  {
    addressLinkId: int('address_link_id').autoincrement().primaryKey(),
    addressId: int('address_id')
      .notNull()
      .references(() => addresses.addressId),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    entityTypeId: int('entity_type_id')
      .notNull()
      .references(() => entityTypes.id),
    addressTypeId: int('address_type_id')
      .notNull()
      .references(() => addressTypes.id),
    ...timestamps,
  },
  (table) => ({
    idxEntity: index('idx_addresses_link_entity').on(
      table.entityId,
      table.entityTypeId
    ),
    idxAddress: index('idx_addresses_link_address').on(table.addressId),
    uqLink: uniqueIndex('uq_addresses_link_unique').on(
      table.addressId,
      table.entityId,
      table.entityTypeId,
      table.addressTypeId
    ),
  })
);

export const addressesLinkRelations = relations(addressesLink, ({ one }) => ({
  address: one(addresses, {
    fields: [addressesLink.addressId],
    references: [addresses.addressId],
  }),
  entityType: one(entityTypes, {
    fields: [addressesLink.entityTypeId],
    references: [entityTypes.id],
  }),
  addressType: one(addressTypes, {
    fields: [addressesLink.addressTypeId],
    references: [addressTypes.id],
  }),
}));
