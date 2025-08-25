import { z } from 'zod';
import { OAuthZodMessage } from '../oauth.constants';
import {
  loginUserDataSchema,
  loginTokensSchema,
} from '../../login/validators/login.dto';
import { isValidPhoneNumberFormat } from '../utils/phoneNumber.util';

// OAuth initiation request schema
export const oauthInitiationSchemaDto = z.object({
  userTypeId: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: OAuthZodMessage.INVALID_USER_TYPE_ID,
        });
        return z.NEVER;
      }
      return parsed;
    })
    .optional(),
});

// OAuth link account request schema
export const oauthLinkSchemaDto = z.object({
  provider: z.string().min(1, OAuthZodMessage.PROVIDER_REQUIRED),
  providerUserId: z.string().min(1, OAuthZodMessage.PROVIDER_USER_ID_REQUIRED),
  providerEmail: z.string().email(OAuthZodMessage.EMAIL_INVALID).optional(),
  providerName: z.string().optional(),
  providerPicture: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

// OAuth metadata schema for response
export const oauthMetadataSchema = z.object({
  provider: z.string(),
  providerEmail: z.string().optional(),
  connectedAt: z.string().optional(),
});

// OAuth login response data schema
export const oauthLoginDataSchema = z.object({
  user: loginUserDataSchema,
  tokens: loginTokensSchema,
  expiresIn: z.number(),
  oauth: oauthMetadataSchema,
  isNewUser: z.boolean(),
});

// OAuth management response data schema
export const oauthManagementDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// OAuth connections response data schema
export const oauthConnectionsDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.number(),
      provider: z.string(),
      providerUserId: z.string(),
      providerEmail: z.string().optional(),
      providerName: z.string().optional(),
      createdAt: z.string(),
    })
  ),
});

// OAuth status check response data schema
export const oauthStatusDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    provider: z.string(),
    connected: z.boolean(),
  }),
});

// API Response schemas
export const oauthLoginApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: oauthLoginDataSchema,
  message: z.string(),
  success: z.boolean(),
});

export const oauthManagementApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: oauthManagementDataSchema,
  message: z.string(),
  success: z.boolean(),
});

export const oauthConnectionsApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: oauthConnectionsDataSchema.shape.data,
  message: z.string(),
  success: z.boolean(),
});

export const oauthStatusApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: oauthStatusDataSchema.shape.data,
  message: z.string(),
  success: z.boolean(),
});

// New phone verification schemas
export const phoneVerificationRequestSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .refine((phone) => isValidPhoneNumberFormat(phone), {
      message:
        'Invalid phone number format. Please use a valid phone number with country code if needed.',
    }),
});

export const phoneVerificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    userId: z.number(),
    phoneNumber: z.string(),
    otpSent: z.boolean(),
    message: z.string(),
  }),
});

// Phone verification API response schema
export const phoneVerificationApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: phoneVerificationResponseSchema.shape.data,
  message: z.string(),
  success: z.boolean(),
});

// Phone OTP verification schema
export const phoneOtpVerifyRequestSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const phoneOtpVerifyApiResponseSchema = z.object({
  statusCode: z.number().int(),
  data: z.object({
    userId: z.number(),
    phone_verified: z.boolean(),
  }),
  message: z.string(),
  success: z.boolean(),
});

// Export types
export type OAuthInitiationRequest = z.infer<typeof oauthInitiationSchemaDto>;
export type OAuthLinkRequest = z.infer<typeof oauthLinkSchemaDto>;
export type OAuthLoginData = z.infer<typeof oauthLoginDataSchema>;
export type OAuthManagementData = z.infer<typeof oauthManagementDataSchema>;
export type OAuthConnectionsData = z.infer<typeof oauthConnectionsDataSchema>;
export type OAuthStatusData = z.infer<typeof oauthStatusDataSchema>;
// New phone verification types
export type PhoneVerificationRequest = z.infer<
  typeof phoneVerificationRequestSchema
>;
export type PhoneVerificationResponse = z.infer<
  typeof phoneVerificationResponseSchema
>;
export type PhoneOtpVerifyRequest = z.infer<typeof phoneOtpVerifyRequestSchema>;
