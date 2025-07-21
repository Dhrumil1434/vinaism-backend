import { mysqlTable, int, decimal, text } from 'drizzle-orm/mysql-core';
import { timestamps } from './helpers/column.helpers';
import { taskAssignments } from './taskAssignment.schema';
import { workers } from './worker.schema';

export const timeLogs = mysqlTable('time_logs', {
  logId: int('log_id').autoincrement().primaryKey(),
  taskId: int('task_id')
    .references(() => taskAssignments.taskId, { onDelete: 'cascade' })
    .notNull(),
  workerId: int('worker_id')
    .references(() => workers.workerId, { onDelete: 'restrict' })
    .notNull(),
  startTime: timestamps.createdAt, // Using createdAt helper for start_time
  endTime: timestamps.updatedAt, // Using updatedAt helper for end_time (or define a new timestamp column)
  hoursWorked: decimal('hours_worked', { precision: 5, scale: 2 }).notNull(),
  notes: text('notes'),
  ...timestamps, // Has its own createdAt/updatedAt
});
