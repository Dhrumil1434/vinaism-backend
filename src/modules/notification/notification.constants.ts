// Keep DB-facing type in sync with notification.schema.ts mysql enum
export enum NotificationKind {
  System = 'System',
  Task = 'Task',
  Approval = 'Approval',
  Alert = 'Alert',
}

export const NotificationAction = {
  CREATE: 'NOTIFICATION_CREATE',
  READ: 'NOTIFICATION_READ',
  UPDATE: 'NOTIFICATION_UPDATE',
} as const;

export const NotificationMessage = {
  DEFAULT_CREATED: 'Notification created',
  FETCHED: 'Notifications fetched successfully',
  MARKED_READ: 'Notification marked as read',
  MARKED_ALL_READ: 'All notifications marked as read',
} as const;

export const NotificationErrorCode = {
  INVALID_TARGET: 'INVALID_NOTIFICATION_TARGET',
  CREATE_FAILED: 'NOTIFICATION_CREATE_FAILED',
} as const;
