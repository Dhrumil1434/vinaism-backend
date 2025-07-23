import { z } from 'zod';

const typeNameSchema = z
  .string()
  .trim()
  .min(1, 'Type name is required')
  .max(100, 'Type name must be at most 100 characters')
  .regex(
    /^[A-Za-z][A-Za-z0-9]*$/,
    'Type name must start with a letter and contain only letters and numbers'
  );

const descriptionSchema = z
  .string()
  .max(255, 'Description must be at most 255 characters');
// Zod schema for the full userType record (DB response)
export const userTypeRecordSchema = z.object({
  userTypeId: z.number().int().positive(),
  typeName: typeNameSchema,
  description: descriptionSchema.nullable(), // allow null in DB
  is_active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
// Zod schema for userType creation (POST)
export const userTypeCreateSchema = z.object({
  typeName: typeNameSchema,
  description: descriptionSchema.optional(), // allow undefined in request
});

// Zod schema for userType update (PATCH/PUT)
export const userTypeUpdateSchema = userTypeRecordSchema
  .pick({
    typeName: true,
    description: true,
  })
  .optional();

// Zod schema for userTypeId param (for routes that require an ID)
export const userTypeIdParamSchema = z.object({
  userTypeId: z
    .number()
    .int('User type ID must be an integer')
    .positive('User type ID must be positive'),
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

const baseFilter = userTypeRecordSchema
  .pick({
    userTypeId: true,
    typeName: true,
    description: true,
    is_active: true,
  })
  .partial();
export const userTypeFilterSchema = baseFilter
  .extend({
    userTypeId: z.string().optional(),
    is_active: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
  })
  .strict();
export type UserTypeFilters = z.infer<typeof userTypeFilterSchema>;
