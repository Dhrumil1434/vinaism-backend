import { db } from '../../../db/mysql.db';
import { users } from '@schema-models';
import { oauthMetadata } from '@schema-models';
import { eq, and } from 'drizzle-orm';
import { OAuthProvider } from './validators/oauth.types';

export class OAuthSchemaRepo {
  /**
   * Find OAuth metadata by provider and provider user ID
   */
  static async findByProviderAndUserId(
    provider: OAuthProvider,
    providerUserId: string
  ) {
    const result = await db
      .select()
      .from(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.provider, provider),
          eq(oauthMetadata.providerUserId, providerUserId)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find OAuth metadata by user ID and provider
   */
  static async findByUserIdAndProvider(
    userId: number,
    provider: OAuthProvider
  ) {
    const result = await db
      .select()
      .from(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.userId, userId),
          eq(oauthMetadata.provider, provider)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create new OAuth metadata
   */
  static async createOAuthMetadata(data: {
    userId: number;
    provider: OAuthProvider;
    providerUserId: string;
    providerEmail?: string;
    providerName?: string;
    providerPicture?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }) {
    const result = await db.insert(oauthMetadata).values(data);
    return result[0].insertId;
  }

  /**
   * Update OAuth metadata
   */
  static async updateOAuthMetadata(
    id: number,
    data: {
      providerEmail?: string;
      providerName?: string;
      providerPicture?: string;
      accessToken?: string;
      refreshToken?: string;
      tokenExpiresAt?: Date;
    }
  ) {
    await db.update(oauthMetadata).set(data).where(eq(oauthMetadata.id, id));
  }

  /**
   * Get all OAuth connections for a user
   */
  static async getUserOAuthConnections(userId: number) {
    return await db
      .select()
      .from(oauthMetadata)
      .where(eq(oauthMetadata.userId, userId));
  }

  /**
   * Delete OAuth connection
   */
  static async deleteOAuthConnection(userId: number, provider: OAuthProvider) {
    await db
      .delete(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.userId, userId),
          eq(oauthMetadata.provider, provider)
        )
      );
  }

  /**
   * Check if user has OAuth connection for specific provider
   */
  static async hasOAuthConnection(userId: number, provider: OAuthProvider) {
    const result = await db
      .select({ id: oauthMetadata.id })
      .from(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.userId, userId),
          eq(oauthMetadata.provider, provider)
        )
      )
      .limit(1);

    return result.length > 0;
  }
}
