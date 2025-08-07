import z from 'zod';
import { OAuthZodMessage } from '../oauth.constants';

export const oauthId = z.number().int().positive();
export const oauthUserId = z
  .number(OAuthZodMessage.USER_ID_REQUIRED)
  .int()
  .positive();
export const oauthProvider = z
  .string()
  .nonempty(OAuthZodMessage.PROVIDER_REQUIRED);
export const oauthProviderUserId = z
  .string()
  .nonempty(OAuthZodMessage.PROVIDER_USER_ID_REQUIRED);
export const oauthProviderEmail = z
  .string()
  .email(OAuthZodMessage.EMAIL_INVALID)
  .optional();
export const oauthProviderName = z.string().optional();
export const oauthProviderPicture = z.string().url().optional();
export const oauthAccessToken = z.string().optional();
export const oauthRefreshToken = z.string().optional();
export const oauthTokenExpiresAt = z.coerce.date().optional();
export const oauthIsActive = z.boolean().default(true).optional();
export const oauthCreatedAt = z.date().or(z.string());
export const oauthUpdatedAt = z.date().or(z.string());

export const oauthBaseFields = {
  id: oauthId,
  userId: oauthUserId,
  provider: oauthProvider,
  providerUserId: oauthProviderUserId,
  providerEmail: oauthProviderEmail,
  providerName: oauthProviderName,
  providerPicture: oauthProviderPicture,
  accessToken: oauthAccessToken,
  refreshToken: oauthRefreshToken,
  tokenExpiresAt: oauthTokenExpiresAt,
  is_active: oauthIsActive,
  createdAt: oauthCreatedAt,
  updatedAt: oauthUpdatedAt,
};

export const OAuthSelectSchema = z.object(oauthBaseFields);

export const OAuthInsertSchema = OAuthSelectSchema.omit({
  id: true,
  createdAt: true,
  is_active: true,
});

export const OAuthUpdateSchema = OAuthSelectSchema.partial();

export const OAuthTokenSchema = OAuthSelectSchema.pick({
  accessToken: true,
  refreshToken: true,
  tokenExpiresAt: true,
});

export const OAuthQuerySchema = z.object({
  userId: oauthUserId.optional(),
  provider: oauthProvider.optional(),
  is_active: oauthIsActive.optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

// OAuth Response Schema (for API responses)
export const OAuthResponseSchema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  provider: z.string(),
  providerUserId: z.string(),
  providerEmail: z.string().email().optional(),
  providerName: z.string().optional(),
  providerPicture: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date().or(z.string()).optional(),
  is_active: z.boolean(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

// Zod schema for pagination meta
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
  currentPage: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

// Zod schema for paginated OAuth response
export const paginatedOAuthResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: z.object({
      items: z.array(OAuthResponseSchema),
      meta: paginationMetaSchema,
    }),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// Zod schema for an array of OAuth objects
export const oauthRecordArraySchema = z.array(OAuthResponseSchema);

// Base filter schema
const baseOAuthFilter = OAuthResponseSchema.pick({
  id: true,
  userId: true,
  provider: true,
  providerUserId: true,
  providerEmail: true,
  providerName: true,
  is_active: true,
}).partial();

// Zod schema for OAuth filters
export const oauthFilterSchema = baseOAuthFilter
  .extend({
    userId: z.string().optional(), // For filtering by user ID as string
    provider: z.string().optional(), // For filtering by provider
    is_active: z
      .preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
      }, z.boolean())
      .optional(),
    // Pagination parameters
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
  })
  .strict();

// OAuth Public Schema (for public endpoints - excludes sensitive data)
export const OAuthPublicSchema = OAuthResponseSchema.omit({
  accessToken: true,
  refreshToken: true,
  tokenExpiresAt: true,
});

// OAuth Create Request Schema (for creating new OAuth connections)
export const OAuthCreateRequestSchema = z.object({
  userId: z.number().positive(),
  provider: z.string().nonempty(),
  providerUserId: z.string().nonempty(),
  providerEmail: z.string().email().optional(),
  providerName: z.string().optional(),
  providerPicture: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.coerce.date().optional(),
});

// OAuth Update Request Schema (for updating OAuth connections)
export const OAuthUpdateRequestSchema = OAuthCreateRequestSchema.partial().omit(
  {
    userId: true, // Cannot update user ID
    provider: true, // Cannot update provider
    providerUserId: true, // Cannot update provider user ID
  }
);

// OAuth Link Request Schema (for linking OAuth to existing user)
export const OAuthLinkRequestSchema = z.object({
  provider: z.string().nonempty(),
  providerUserId: z.string().nonempty(),
  providerEmail: z.string().email().optional(),
  providerName: z.string().optional(),
  providerPicture: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.coerce.date().optional(),
});
