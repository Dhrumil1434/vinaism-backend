import { mysqlTable, int, varchar, decimal } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { projects } from './project.schema';

export const projectSpaceDetails = mysqlTable('project_space_details', {
  projectId: int('project_id')
    .notNull()
    .primaryKey()
    .references(() => projects.projectId, { onDelete: 'cascade' }),
  projectSqft: decimal('project_sqft', { precision: 10, scale: 2 }).notNull(),
  projectCategory: varchar('project_category', { length: 100 }).notNull(),
  ...timestamps,
});
