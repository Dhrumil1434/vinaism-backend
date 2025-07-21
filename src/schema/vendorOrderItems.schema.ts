import { mysqlTable, int, varchar, decimal } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { vendorOrders } from './vendorOrder.schema';

export const vendorOrderItems = mysqlTable('vendor_order_items', {
  orderItemId: int('order_item_id').autoincrement().primaryKey(),
  vendorOrderId: int('vendor_order_id')
    .references(() => vendorOrders.vendorOrderId, { onDelete: 'cascade' })
    .notNull(),
  materialProductName: varchar('material_product_name', {
    length: 255,
  }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  ...timestamps,
});
