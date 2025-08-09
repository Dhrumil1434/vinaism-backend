import { getDisplayPhoneNumber } from './phoneNumber.util';

/**
 * Sanitize user data for API responses
 * Converts OAuth placeholder phone numbers to null for clean API responses
 */
export function sanitizeUserData(user: any): any {
  if (!user) return user;

  return {
    ...user,
    phoneNumber: getDisplayPhoneNumber(user.phoneNumber),
  };
}

/**
 * Sanitize array of user data for API responses
 */
export function sanitizeUserArray(users: any[]): any[] {
  return users.map(sanitizeUserData);
}

/**
 * Check if user was created via OAuth
 * OAuth users have placeholder phone numbers
 */
export function isOAuthUser(user: any): boolean {
  return user?.phoneNumber?.startsWith('oauth_') ?? false;
}
