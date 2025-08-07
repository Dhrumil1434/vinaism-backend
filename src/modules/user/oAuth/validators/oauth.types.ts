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

export type OAuthSelect = z.infer<typeof OAuthSelectSchema>;
export type OAuthInsert = z.infer<typeof OAuthInsertSchema>;
export type OAuthUpdate = z.infer<typeof OAuthUpdateSchema>;
export type OAuthResponse = z.infer<typeof OAuthResponseSchema>;
export type OAuthPublic = z.infer<typeof OAuthPublicSchema>;
export type OAuthCreateRequest = z.infer<typeof OAuthCreateRequestSchema>;
export type OAuthUpdateRequest = z.infer<typeof OAuthUpdateRequestSchema>;
export type OAuthLinkRequest = z.infer<typeof OAuthLinkRequestSchema>;
export type OAuthFilters = z.infer<typeof oauthFilterSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedOAuthResponse = z.infer<
  typeof paginatedOAuthResponseSchema
>;
