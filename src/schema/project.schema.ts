import { mysqlTable, int, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { client } from './client.schema';

export const projects = mysqlTable('projects', {
  projectId: int('project_id').autoincrement().primaryKey(),
  clientId: int('client_id')
    .references(() => client.clientId, { onDelete: 'restrict' })
    .notNull(),
  projectName: varchar('project_name', { length: 255 }).notNull(),
  projectType: mysqlEnum('project_type', [
    'Product Design',
    'Space Design',
    'Other',
  ]).notNull(),
  nocLetterUrl: varchar('noc_letter_url', { length: 500 }),
  ...timestamps,
});
