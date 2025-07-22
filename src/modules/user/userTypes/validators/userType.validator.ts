import { z } from 'zod';

// Zod schema for userType creation (POST)
export const userTypeCreateSchema = z.object({
  typeName: z
    .string()
    .min(1, 'Type name is required')
    .max(100, 'Type name must be at most 100 characters'),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters')
    .optional(),
});

// Zod schema for userType update (PATCH/PUT)
export const userTypeUpdateSchema = z.object({
  typeName: z
    .string()
    .min(1, 'Type name is required')
    .max(100, 'Type name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters')
    .optional(),
});

// Zod schema for userTypeId param (for routes that require an ID)
export const userTypeIdParamSchema = z.object({
  userTypeId: z
    .number()
    .int('User type ID must be an integer')
    .positive('User type ID must be positive'),
});

// Zod schema for the full userType record (DB response)
const userTypeRecordSchema = z.object({
  userTypeId: z.number().int().positive(),
  typeName: z.string().min(1).max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 👇 Schema for an array of userType objects
export const userTypeRecordArraySchema = z.array(userTypeRecordSchema);
