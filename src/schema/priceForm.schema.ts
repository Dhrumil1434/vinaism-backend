import {
  mysqlTable,
  int,
  varchar,
  decimal,
  date,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { vendorOrders } from './vendorOrder.schema';
import { suppliers } from './supplier.schema';

export const priceForms = mysqlTable('price_forms', {
  priceFormId: int('price_form_id').autoincrement().primaryKey(),
  vendorOrderId: int('vendor_order_id')
    .references(() => vendorOrders.vendorOrderId, { onDelete: 'cascade' })
    .notNull(),
  supplierId: int('supplier_id')
    .references(() => suppliers.supplierId, { onDelete: 'restrict' })
    .notNull(),
  quotationNumber: varchar('quotation_number', { length: 100 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  finalAmount: decimal('final_amount', { precision: 12, scale: 2 }).notNull(),
  validityDate: date('validity_date', { mode: 'string' }).notNull(),
  status: mysqlEnum('status', [
    'Draft',
    'Submitted',
    'Approved',
    'Rejected',
  ]).notNull(),
  ...timestamps,
});
