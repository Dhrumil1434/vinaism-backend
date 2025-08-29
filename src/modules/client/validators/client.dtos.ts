import { z } from 'zod';
import { clientZodMessage } from '../client.constants';
import { paginationMetaSchema } from 'modules/user/oAuth/validators/oauth.dtos';

// client schema data fields

const regexForValidString = /^[A-Za-z][A-Za-z0-9\s.&-]*$/;
const userId = z.int().positive();
const clientId = userId;
const gstRegex =
  /^(0[1-9]|1[0-9]|2[0-9]|3[0-7])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const gstNumber = z
  .string()
  .trim()
  .toUpperCase()
  .regex(gstRegex, clientZodMessage.INVALID_GST_NUMBER);

const billingFirmName = z
  .string()
  .min(3, 'Billing firm name must be at least 3 characters')
  .regex(regexForValidString, clientZodMessage.INVALID_STRING_STRUCTURE)
  .transform((val) => val.toLowerCase());
const officeMobileNumber = z
  .string()
  .length(10, clientZodMessage.INVALID_PHONE)
  .regex(/^[0-9]{10,15}$/, clientZodMessage.INVALID_PHONE)
  .nonempty(clientZodMessage.PHONE_REQUIRED);
const companyLogo = z
  .string()
  .max(200, clientZodMessage.LOGO_PATH_TOO_LONG)
  .optional();
const createdAt = z.date().or(z.string());
const updatedAt = z.date().or(z.string());

export const clientSchemaResponse = z
  .object({
    userId: userId,
    clientId: clientId,
    gstNumber: gstNumber,
    billingFirmName: billingFirmName,
    officeMobileNumber: officeMobileNumber,
    createdAt: createdAt,
    updatedAt: updatedAt,
    companyLogo: companyLogo,
  })
  .strict();

export const clientCreateDto = clientSchemaResponse
  .pick({
    gstNumber: true,
    officeMobileNumber: true,
    billingFirmName: true,
    companyLogo: true,
  })
  .strict();

export const clientUpdateDto = clientSchemaResponse
  .pick({
    gstNumber: true,
    billingFirmName: true,
    officeMobileNumber: true,
    companyLogo: true,
  })
  .partial()
  .strict();

const clientArrayResponse = z.array(clientSchemaResponse);
const baseClientFilter = clientSchemaResponse.pick({
  userId: true,
  clientId: true,
  billingFirmName: true,
  officeMobileNumber: true,
});
export const ClientFilterDto = baseClientFilter
  .extend({
    clientId: z.string().optional(), // For query params
    userId: z.string().optional(),
    is_active: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
    // Add sorting
    sortBy: z
      .enum(['clientId', 'userId', 'billingFirmName', 'createdAt', 'updatedAt'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict();

// Paginated response (your standard format)
export const PaginatedClientResponseDto = z
  .object({
    statusCode: z.number().int(),
    data: z.object({
      items: clientArrayResponse,
      meta: paginationMetaSchema,
    }),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();
