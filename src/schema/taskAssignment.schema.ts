import { mysqlTable, int, text, date, mysqlEnum } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { workers } from './worker.schema';
import { projects } from './project.schema';
import { users } from './user.schema';

export const taskAssignments = mysqlTable('task_assignments', {
  taskId: int('task_id').autoincrement().primaryKey(),
  workerId: int('worker_id')
    .references(() => workers.workerId, { onDelete: 'restrict' })
    .notNull(),
  projectId: int('project_id')
    .references(() => projects.projectId, { onDelete: 'restrict' })
    .notNull(),
  assignedByUserId: int('assigned_by_user_id')
    .references(() => users.userId, { onDelete: 'restrict' })
    .notNull(),
  taskDescription: text('task_description').notNull(),
  status: mysqlEnum('status', [
    'Not Started',
    'In Progress',
    'Completed',
    'Delayed',
    'Cancelled',
  ]).notNull(),
  startDate: date('start_date', { mode: 'string' }).notNull(),
  endDate: date('end_date', { mode: 'string' }).notNull(),
  priority: mysqlEnum('priority', ['Low', 'Medium', 'High'])
    .notNull()
    .default('Medium'),
  ...timestamps,
});
