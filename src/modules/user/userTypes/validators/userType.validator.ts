import { z } from 'zod';

// Zod schema for userType creation (POST)
export const userTypeCreateSchema = z.object({
  typeName: z
    .string()
    .trim()
    .min(1, 'Type name is required')
    .max(100, 'Type name must be at most 100 characters')
    .regex(
      /^[A-Za-z][A-Za-z0-9]*$/,
      'Type name must start with a letter and contain only letters and numbers'
    ),
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
  typeName: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9]+$/, {
      // <-- This is the key change!
      message:
        'Type name must contain only alphanumeric characters (letters and numbers).',
    })
    .max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 👇 Schema for an array of userType objects
export const userTypeRecordArraySchema = z.array(userTypeRecordSchema);

// Zod schema for pagination meta
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
  currentPage: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

// Zod schema for paginated userType response
export const paginatedUserTypeResponseSchema = z.object({
  statusCode: z.number().int(),
  data: z.object({
    items: userTypeRecordArraySchema,
    meta: paginationMetaSchema,
  }),
  message: z.string(),
  success: z.boolean(),
});

export const userTypeFilterSchema = z
  .object({
    userTypeId: z.string().optional(),
    typeName: z.string().optional(),
    description: z.string().optional(),
    is_active: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
  })
  .strict();
export type UserTypeFilters = z.infer<typeof userTypeFilterSchema>;
