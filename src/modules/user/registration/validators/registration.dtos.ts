import z from 'zod';
import { UserRegistrationZodMessage } from '../registration.constants';
import { userTypeRecordSchema } from 'modules/user/userTypes/validators/userType.validator';

const userName = z
  .string()
  .min(3, UserRegistrationZodMessage.MIN_LENGHT_USER_NAME);
const profilePicture = z.string(
  UserRegistrationZodMessage.PROFILE_PICTURE_TYPE
);
const phoneNumber = z
  .string()
  .regex(/^[0-9]{10,15}$/, UserRegistrationZodMessage.INVALID_PHONE)
  .nonempty(UserRegistrationZodMessage.PHONE_REQUIRED);
const email = z
  .string()
  .nonempty(UserRegistrationZodMessage.EMAIL_REQUIRED)
  .email(UserRegistrationZodMessage.EMAIL_INVALID);
const firstName = z
  .string()
  .nonempty(UserRegistrationZodMessage.FIRST_NAME_REQUIRED);
const lastName = z
  .string()
  .nonempty(UserRegistrationZodMessage.LAST_NAME_REQUIRED);
const password = z.string().min(6, UserRegistrationZodMessage.PASSWORD_MIN);
const userType = z.coerce
  .number(UserRegistrationZodMessage.USER_TYPE_REQUIRED)
  .int();
const is_active = z.boolean().default(false).optional();
const email_verified = z.boolean().default(false).optional();
const phone_verified = z.boolean().default(false).optional();
const admin_approved = z.boolean().default(false).optional();

export const UserRegistrationInsertSchemaDto = z.object({
  userName: userName,
  profilePicture: profilePicture,
  firstName: firstName,
  lastName: lastName,
  password: password,
  phoneNumber: phoneNumber,
  email: email,
  userType: userType,
  is_active: is_active,
  email_verified: email_verified,
  phone_verified: phone_verified,
  admin_approved: admin_approved,
});

export const UserRegistrationResponseSchema =
  UserRegistrationInsertSchemaDto.extend({
    userId: z.number().positive(),
    userType: userTypeRecordSchema,
    email_verified: z.boolean(),
    phone_verified: z.boolean(),
    admin_approved: z.boolean(),
    createdAt: z.date().or(z.string()),
    updatedAt: z.date().or(z.string()),
  });

// New validators for GET APIs

// Zod schema for pagination meta
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
  currentPage: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

// Zod schema for paginated user registration response
export const paginatedUserRegistrationResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: z.object({
      items: z.array(UserRegistrationResponseSchema),
      meta: paginationMetaSchema,
    }),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// Zod schema for an array of user registration objects
export const userRegistrationRecordArraySchema = z.array(
  UserRegistrationResponseSchema
);

// Base filter schema
const baseFilter = UserRegistrationResponseSchema.pick({
  userId: true,
  userName: true,
  email: true,
  phoneNumber: true,
  firstName: true,
  lastName: true,
  userType: true,
  is_active: true,
  email_verified: true,
  phone_verified: true,
  admin_approved: true,
}).partial();

// Zod schema for user registration filters
export const userRegistrationFilterSchema = baseFilter
  .extend({
    userId: z.string().optional(),
    userType: z.string().optional(), // For filtering by userType ID
    is_active: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
    email_verified: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
    phone_verified: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
    admin_approved: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
  })
  .strict();

export type UserRegistrationFilters = z.infer<
  typeof userRegistrationFilterSchema
>;
