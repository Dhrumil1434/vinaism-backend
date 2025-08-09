import { oauthMetadata, users } from '@schema-models';
import { db } from 'db/mysql.db';
import { and, eq } from 'drizzle-orm';
import { handleOAuthPhoneNumber } from './utils/phoneNumber.util';

export class OAuthSchemaRepo {
  /**
   * Find OAuth record by provider and provider user ID
   *
   * Steps to implement:
   * 1. Query oauthMetadata table for matching provider and providerUserId
   * 2. Filter by is_active = true
   * 3. Return first matching record or null
   */
  static async findByProviderAndUserId(
    provider: string,
    providerUserId: string
  ) {
    const [result] = await db
      .select()
      .from(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.provider, provider),
          eq(oauthMetadata.providerUserId, providerUserId),
          eq(oauthMetadata.is_active, true)
        )
      );
    return result;
    // TODO: Implement find OAuth record by provider and user ID
    // 1. Use db.select().from(oauthMetadata)
    // 2. Add where conditions: provider, providerUserId, is_active = true
    // 3. Return first result or null
  }

  /**
   * Find user by email
   *
   * Steps to implement:
   * 1. Query users table for matching email
   * 2. Return first matching user or null
   */
  static async findUserByEmail(email: string) {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result || null;
  }

  /**
   * Get user by OAuth record ID
   *
   * Steps to implement:
   * 1. Join users and oauthMetadata tables
   * 2. Filter by oauthMetadata.id
   * 3. Return user data with OAuth information
   */
  static async getUserByOAuthId(oauthId: number) {
    const [result] = await db
      .select()
      .from(users)
      .innerJoin(oauthMetadata, eq(users.userId, oauthMetadata.userId))
      .where(eq(oauthMetadata.id, oauthId));
    return result || null;
  }

  /**
   * Create new OAuth record
   *
   * Steps to implement:
   * 1. Insert new record into oauthMetadata table
   * 2. Include all required fields from data parameter
   * 3. Set createdAt and updatedAt timestamps
   * 4. Return created record
   */
  static async createOAuthRecord(data: {
    userId: number;
    provider: string;
    providerUserId: string;
    providerEmail?: string;
    providerName?: string;
    providerPicture?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }) {
    const now = new Date().toISOString();
    const [result] = await db.insert(oauthMetadata).values({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return result;
  }

  /**
   * Update OAuth tokens
   *
   * Steps to implement:
   * 1. Update oauthMetadata table for specific oauthId
   * 2. Update accessToken, refreshToken, tokenExpiresAt, updatedAt
   * 3. Return update result
   */
  static async updateOAuthTokens(
    oauthId: number,
    tokens: {
      accessToken: string;
      refreshToken?: string;
      tokenExpiresAt: Date;
    }
  ) {
    const [result] = await db
      .update(oauthMetadata)
      .set({
        ...tokens,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(oauthMetadata.id, oauthId));
    return result;
  }

  /**
   * Create new user
   *
   * Steps to implement:
   * 1. Insert new user into users table
   * 2. Include all required fields (userName, profilePicture, phoneNumber, etc.)
   * 3. Set appropriate default values for OAuth users
   * 4. Return created user
   */
  static async createUser(userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    userType: number;
    profilePicture?: string;
    phoneNumber?: string; // Phone number from OAuth provider (optional)
  }) {
    const now = new Date().toISOString();

    // Generate username from email (first part before @)
    const userName = userData.email.split('@')[0];

    // Handle phone number: use real phone from OAuth provider if available,
    // otherwise generate unique placeholder to prevent DB constraint violations
    const { phoneNumber, isRealPhone } = handleOAuthPhoneNumber(
      userData.phoneNumber,
      userData.userType
    );

    const [result] = await db.insert(users).values({
      userName: userName || '',
      profilePicture: userData.profilePicture || '',
      phoneNumber: phoneNumber, // Real phone from OAuth or unique placeholder
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      password: null, // OAuth users don't need passwords
      userType: userData.userType,
      email_verified: true, // OAuth emails are pre-verified
      phone_verified: isRealPhone, // True if OAuth provider gave real phone, false for placeholder
      admin_approved: false, // Will need admin approval
      createdAt: now,
      updatedAt: now,
    });
    return result;
  }

  /**
   * Delete OAuth record (soft delete by setting is_active to false)
   *
   * Steps to implement:
   * 1. Update oauthMetadata table for specific userId and provider
   * 2. Set is_active to false and update updatedAt
   * 3. Filter by is_active = true to ensure record exists
   * 4. Return update result
   */
  static async deleteOAuthRecord(userId: number, provider: string) {
    const [result] = await db
      .update(oauthMetadata)
      .set({
        is_active: false,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(oauthMetadata.userId, userId),
          eq(oauthMetadata.provider, provider),
          eq(oauthMetadata.is_active, true)
        )
      );
    return result;
  }

  /**
   * Get user's OAuth connections
   *
   * Steps to implement:
   * 1. Query oauthMetadata table for all active records for user
   * 2. Select relevant fields (id, provider, providerUserId, etc.)
   * 3. Filter by userId and is_active = true
   * 4. Return array of OAuth connections
   */
  static async getUserOAuthConnections(userId: number) {
    const results = await db
      .select({
        id: oauthMetadata.id,
        provider: oauthMetadata.provider,
        providerUserId: oauthMetadata.providerUserId,
        providerEmail: oauthMetadata.providerEmail,
        providerName: oauthMetadata.providerName,
        createdAt: oauthMetadata.createdAt,
      })
      .from(oauthMetadata)
      .where(
        and(eq(oauthMetadata.userId, userId), eq(oauthMetadata.is_active, true))
      );
    return results;
  }

  /**
   * Check if user has OAuth connection for specific provider
   *
   * Steps to implement:
   * 1. Query oauthMetadata table for specific userId and provider
   * 2. Filter by is_active = true
   * 3. Return boolean indicating if connection exists
   */
  static async hasOAuthConnection(userId: number, provider: string) {
    const [result] = await db
      .select({ id: oauthMetadata.id })
      .from(oauthMetadata)
      .where(
        and(
          eq(oauthMetadata.userId, userId),
          eq(oauthMetadata.provider, provider),
          eq(oauthMetadata.is_active, true)
        )
      );
    return !!result;
  }
}
