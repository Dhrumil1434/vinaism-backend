import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { NotificationKind } from '../notification.constants';

export const notificationEntitySchema = z.object({
  notificationId: z.number().int(),
  userId: z.number().int(),
  message: z.string(),
  notificationType: z.nativeEnum(NotificationKind),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createNotificationSchema = z.object({
  type: z.nativeEnum(NotificationKind),
  to: z.object({
    userId: z.number().int(),
  }),
  message: z.string().min(1),
});

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['all', 'unread', 'read']).default('all'),
  type: z.nativeEnum(NotificationKind).optional(),
});

export const markReadParamSchema = z.object({
  id: z.coerce.number().int(),
});

const apiBase = {
  statusCode: z.number().int(),
  message: z.string(),
  success: z.boolean(),
};

export const notificationsListApiResponseSchema = z.object({
  ...apiBase,
  data: z.object({
    items: z.array(notificationEntitySchema),
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
  }),
});

export const notificationCreatedApiResponseSchema = z.object({
  ...apiBase,
  statusCode: z.literal(StatusCodes.CREATED),
  data: z.object({
    created: z.literal(true),
  }),
});

export const notificationMarkReadApiResponseSchema = z.object({
  ...apiBase,
  data: z.object({
    id: z.number().int(),
    isRead: z.literal(true),
  }),
});

export const notificationMarkAllReadApiResponseSchema = z.object({
  ...apiBase,
  data: z.object({
    updated: z.literal(true),
  }),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type ListNotificationsQuery = z.infer<
  typeof listNotificationsQuerySchema
>;
export type MarkReadParams = z.infer<typeof markReadParamSchema>;
