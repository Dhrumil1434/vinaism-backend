import { mysqlTable, int, mysqlEnum } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { projects } from './project.schema';
import { vendors } from './vendor.schema';
import { users } from './user.schema';
import { contacts } from './contact.schema';

export const vendorOrders = mysqlTable('vendor_orders', {
  vendorOrderId: int('vendor_order_id').autoincrement().primaryKey(),
  projectId: int('project_id')
    .references(() => projects.projectId, { onDelete: 'restrict' })
    .notNull(),
  vendorId: int('vendor_id')
    .references(() => vendors.vendorId, { onDelete: 'restrict' })
    .notNull(),
  createdByUserId: int('created_by_user_id')
    .references(() => users.userId, { onDelete: 'restrict' })
    .notNull(),
  onsitePersonContactId: int('onsite_person_contact_id').references(
    () => contacts.contactId,
    { onDelete: 'set null' }
  ),
  authenticationStatus: mysqlEnum('authentication_status', [
    'Pending',
    'Approved',
    'Rejected',
  ]).notNull(),
  approvedByUserId: int('approved_by_user_id').references(() => users.userId, {
    onDelete: 'set null',
  }),
  orderDate: timestamps.createdAt, // Using createdAt as orderDate
  returnFormId: int('return_form_id'), // Assuming this would reference another vendor_order_id, handle self-reference in relations if needed.
  ...timestamps, // Has its own createdAt/updatedAt
});
