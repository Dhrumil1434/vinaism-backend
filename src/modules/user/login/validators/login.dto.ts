import { z } from 'zod';
import { UserRegistrationInsertSchemaDto } from 'modules/user/registration/validators/registration.dtos';
import { UserLoginZodMessage } from '../login.constant';
import { userTypeRecordSchema } from 'modules/user/userTypes/validators/userType.validator';

// Base login schema - pick only the fields we need for login
const baseLoginSchema = UserRegistrationInsertSchemaDto.pick({
  password: true, // Password is always required
}).merge(
  UserRegistrationInsertSchemaDto.pick({
    email: true,
    phoneNumber: true,
  }).partial() // Make email and phoneNumber optional
);

// Login request schema with validation
export const userLoginSchemaDto = baseLoginSchema.superRefine((data, ctx) => {
  const emailProvided = data.email != null;
  const phoneProvided = data.phoneNumber != null;

  // Case 1: User provided both. This is an error.
  if (emailProvided && phoneProvided) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: UserLoginZodMessage.NOT_BOTH_EMAIL_PHONE,
      path: ['email'],
    });
  }

  // Case 2: User provided neither. This is an error.
  else if (!emailProvided && !phoneProvided) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: UserLoginZodMessage.EITHER_EMAIL_OR_PHONE,
      path: ['email'],
    });
  }
});

// User data schema for login response (excludes sensitive data)
export const loginUserDataSchema = z.object({
  userId: z.number().positive(),
  userName: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  userType: userTypeRecordSchema.nullable(),
  profilePicture: z.string(),
  email_verified: z.boolean(),
  phone_verified: z.boolean(),
  admin_approved: z.boolean(),
});

// Tokens schema (both access and refresh tokens for frontend)
export const loginTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Login response schema
export const loginResponseSchema = z.object({
  user: loginUserDataSchema,
  tokens: loginTokensSchema,
  expiresIn: z.number(),
});

// Refresh token response schema (only access token in response)
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

// API Response schemas
export const loginApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: loginResponseSchema,
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

export const refreshTokenApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: refreshTokenResponseSchema,
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

export const logoutApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: z.null(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// Infer the TypeScript types
export type UserLoginDto = z.infer<typeof userLoginSchemaDto>;
export type LoginUserData = z.infer<typeof loginUserDataSchema>;
export type LoginTokens = z.infer<typeof loginTokensSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
