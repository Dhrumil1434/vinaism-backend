import { z } from 'zod';

// Zod schema for login attempts record (DB response)
export const loginAttemptsRecordSchema = z.object({
  attemptId: z.number().int().positive(),
  userId: z.number().int().positive(),
  attemptCount: z.number().int().nonnegative(),
  isLocked: z.boolean(),
  lockoutUntil: z.string().nullable(),
  lastAttemptAt: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Zod schema for creating a new login attempt record
export const loginAttemptsCreateSchema = z.object({
  userId: z.number().int().positive(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Zod schema for updating login attempts
export const loginAttemptsUpdateSchema = z.object({
  attemptCount: z.number().int().nonnegative().optional(),
  isLocked: z.boolean().optional(),
  lockoutUntil: z.string().nullable().optional(),
  lastAttemptAt: z.string().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

// Zod schema for attempt ID param
export const attemptIdParamSchema = z.object({
  attemptId: z.preprocess((val) => Number(val), z.number().int().positive()),
});

// Infer TypeScript types
export type LoginAttemptsRecord = z.infer<typeof loginAttemptsRecordSchema>;
export type LoginAttemptsCreate = z.infer<typeof loginAttemptsCreateSchema>;
export type LoginAttemptsUpdate = z.infer<typeof loginAttemptsUpdateSchema>;
