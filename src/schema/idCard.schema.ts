import {
  mysqlTable,
  int,
  varchar,
  date,
  boolean,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { workers } from './worker.schema';
import { projects } from './project.schema';

export const idCards = mysqlTable('id_cards', {
  cardId: int('card_id').autoincrement().primaryKey(),
  workerId: int('worker_id')
    .references(() => workers.workerId, { onDelete: 'restrict' })
    .notNull(),
  projectId: int('project_id')
    .references(() => projects.projectId, { onDelete: 'restrict' })
    .notNull(),
  cardNumber: varchar('card_number', { length: 255 }).notNull().unique(),
  issueDate: date('issue_date', { mode: 'string' }).notNull(),
  validFrom: date('valid_from', { mode: 'string' }).notNull(),
  validTo: date('valid_to', { mode: 'string' }).notNull(),
  status: mysqlEnum('status', ['Active', 'Expired', 'Revoked']).notNull(),
  locationTrackingEnabled: boolean('location_tracking_enabled')
    .notNull()
    .default(false),
  ...timestamps,
});
