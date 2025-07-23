import { sql } from 'drizzle-orm';
import { boolean, timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
  is_active: boolean().default(true), // Issue 1: Missing column name in `boolean()`
  createdAt: timestamp('created_at', { mode: 'string' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(), // Issue 2: Missing .onUpdate() for updated_at
  // Issue 3: Missing column name, mode, and .
};
