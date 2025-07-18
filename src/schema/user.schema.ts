import { mysqlTable, int, varchar, date } from 'drizzle-orm/mysql-core';

export const flyer123 = mysqlTable('flyer123', {
  flyer_id: int('flyer_id').primaryKey().autoincrement().notNull(),
  imported_flyer_id: varchar('imported_flyer_id', { length: 255 }),
  valid_from: date('valid_from', { mode: 'date' }),
  valid_to: date('valid_to', { mode: 'date' }),
});
