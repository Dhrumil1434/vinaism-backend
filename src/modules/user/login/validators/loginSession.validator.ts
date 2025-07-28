import { z } from 'zod';

// Zod schema for login session record (DB response)
export const loginSessionRecordSchema = z.object({
  sessionId: z.number().int().positive(),
  userId: z.number().int().positive(),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  isActive: z.boolean(),
  expiresAt: z.string(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Zod schema for creating a new login session
export const loginSessionCreateSchema = z.object({
  userId: z.number().int().positive(),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  expiresAt: z.string(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

// Zod schema for updating a login session
export const loginSessionUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

// Zod schema for session ID param
export const sessionIdParamSchema = z.object({
  sessionId: z.preprocess((val) => Number(val), z.number().int().positive()),
});

// Infer TypeScript types
export type LoginSessionRecord = z.infer<typeof loginSessionRecordSchema>;
export type LoginSessionCreate = z.infer<typeof loginSessionCreateSchema>;
export type LoginSessionUpdate = z.infer<typeof loginSessionUpdateSchema>;
