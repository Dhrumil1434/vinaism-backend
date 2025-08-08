import z from 'zod';
import {
  OAuthSelectSchema,
  OAuthInsertSchema,
  OAuthUpdateSchema,
  OAuthResponseSchema,
  OAuthPublicSchema,
  OAuthCreateRequestSchema,
  OAuthUpdateRequestSchema,
  OAuthLinkRequestSchema,
  oauthFilterSchema,
  paginationMetaSchema,
  paginatedOAuthResponseSchema,
} from './oauth.dtos';

export type IOAuthInsert = z.infer<typeof OAuthInsertSchema>;
export type IOAuthUpdate = z.infer<typeof OAuthUpdateSchema>;
export type IOAuthSelect = z.infer<typeof OAuthSelectSchema>;
export type IOAuthResponse = z.infer<typeof OAuthResponseSchema>;
export type IOAuthPublic = z.infer<typeof OAuthPublicSchema>;
export type IOAuthCreateRequest = z.infer<typeof OAuthCreateRequestSchema>;
export type IOAuthUpdateRequest = z.infer<typeof OAuthUpdateRequestSchema>;
export type IOAuthLinkRequest = z.infer<typeof OAuthLinkRequestSchema>;
export type IOAuthFilters = z.infer<typeof oauthFilterSchema>;
export type IPaginationMeta = z.infer<typeof paginationMetaSchema>;
export type IPaginatedOAuthResponse = z.infer<
  typeof paginatedOAuthResponseSchema
>;

// Add OAuthProvider type and related interfaces for passport config
export const OAuthProviderSchema = z.enum(['google', 'apple', 'facebook']);
export type IOAuthProvider = z.infer<typeof OAuthProviderSchema>;

export interface IOAuthProfile {
  id: string;
  email: string;
  name?: {
    firstName?: string;
    lastName?: string;
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
  provider: IOAuthProvider;
}
