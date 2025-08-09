import { db } from '../../../../db/mysql.db';
import { userTypes } from '@schema-models';
import { eq } from 'drizzle-orm';
import { OAuthConfig } from '../oauth.constants';

/**
 * Validate if a userTypeId exists in the database
 * @param userTypeId - The user type ID to validate
 * @returns Promise<boolean> - True if valid, false otherwise
 */
export async function validateUserTypeId(userTypeId: number): Promise<boolean> {
  try {
    const [userType] = await db
      .select({ userTypeId: userTypes.userTypeId })
      .from(userTypes)
      .where(eq(userTypes.userTypeId, userTypeId));

    return !!userType;
  } catch (error) {
    console.error('Error validating user type ID:', error);
    return false;
  }
}

/**
 * Get a default user type ID (fallback)
 * @returns Promise<number> - Default user type ID
 */
export async function getDefaultUserTypeId(): Promise<number> {
  try {
    // First, try to use the configured default
    const configuredDefault = OAuthConfig.DEFAULT_USER_TYPE_ID;
    const isDefaultValid = await validateUserTypeId(configuredDefault);

    if (isDefaultValid) {
      return configuredDefault;
    }

    // If configured default doesn't exist, get the first available user type
    const [userType] = await db
      .select({ userTypeId: userTypes.userTypeId })
      .from(userTypes)
      .limit(1);

    if (!userType) {
      throw new Error(
        'No user types found in database. Please seed user types.'
      );
    }

    console.warn(
      `Configured default userType ${configuredDefault} not found. Using ${userType.userTypeId} instead.`
    );
    return userType.userTypeId;
  } catch (error) {
    console.error('Error getting default user type:', error);
    throw new Error(
      'Unable to determine default user type. Please check your user_types table.'
    );
  }
}
