import { mysqlTable, int, varchar, uniqueIndex } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';

export const addressTypes = mysqlTable(
  'address_types',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps,
  },
  (table) => ({
    uqName: uniqueIndex('uq_address_types_name').on(table.name),
  })
);
