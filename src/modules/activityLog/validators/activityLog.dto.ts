import { z } from 'zod';
import {
  ActivityLogActionType,
  ActivityLogResourceType,
} from '../activityLog.constants';

// Base activity log schema
export const activityLogBaseSchema = z.object({
  logId: z.number(),
  userId: z.number().nullable(),
  actionType: z.enum(
    Object.values(ActivityLogActionType) as [string, ...string[]]
  ),
  resourceType: z.enum(
    Object.values(ActivityLogResourceType) as [string, ...string[]]
  ),
  resourceId: z.string().max(255).nullable(),
  details: z.string(),
  ipAddress: z.string().max(45).nullable(),
  actionTimestamp: z.date(),
});

// Create activity log schema
export const createActivityLogSchema = z.object({
  userId: z.number().nullable(),
  actionType: z.enum(
    Object.values(ActivityLogActionType) as [string, ...string[]]
  ),
  resourceType: z.enum(
    Object.values(ActivityLogResourceType) as [string, ...string[]]
  ),
  resourceId: z.string().max(255).nullable(),
  details: z.string(),
  ipAddress: z.string().max(45).nullable(),
});

// Activity log details JSON schema for validation
export const activityLogDetailsSchema = z.object({
  endpoint: z.string().optional(),
  httpMethod: z.string().optional(),
  userAgent: z.string().optional(),
  requestData: z
    .object({
      body: z.any().optional(),
      params: z.any().optional(),
      query: z.any().optional(),
    })
    .optional(),
  responseData: z
    .object({
      status: z.number().optional(),
      body: z.any().optional(),
      processingTime: z.number().optional(),
    })
    .optional(),
  userContext: z
    .object({
      userId: z.number().optional(),
      userType: z.string().optional(),
      sessionId: z.string().optional(),
    })
    .optional(),
  businessContext: z.any().optional(),
  systemContext: z
    .object({
      timestamp: z.date().optional(),
      success: z.boolean().optional(),
    })
    .optional(),
});

// Query schema for listing activity logs
export const listActivityLogsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  actionType: z.string().optional(),
  resourceType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// API Response schemas
export const activityLogCreatedApiResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    logId: z.number(),
    captured: z.boolean(),
  }),
  message: z.string(),
  success: z.boolean(),
});

export const activityLogListApiResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    items: z.array(activityLogBaseSchema),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
  message: z.string(),
  success: z.boolean(),
});

// Type exports
export type ActivityLogBase = z.infer<typeof activityLogBaseSchema>;
export type CreateActivityLog = z.infer<typeof createActivityLogSchema>;
export type ActivityLogDetails = z.infer<typeof activityLogDetailsSchema>;
export type ActivityLogCreatedApiResponse = z.infer<
  typeof activityLogCreatedApiResponseSchema
>;
export type ActivityLogListApiResponse = z.infer<
  typeof activityLogListApiResponseSchema
>;
