import { mysqlTable, int, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const contacts = mysqlTable('contacts', {
  contactId: int('contact_id').autoincrement().primaryKey(),
  entityType: mysqlEnum('entity_type', [
    'Worker',
    'Client',
    'Vendor',
    'Supplier',
    'Designer',
    'User',
  ]).notNull(),
  entityId: varchar('entity_id', { length: 255 }).notNull(),
  relationToEntity: varchar('relation_to_entity', { length: 100 }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  bloodGroup: varchar('blood_group', { length: 10 }),
  ...timestamps,
});
