/**
 * Utility functions for handling OAuth user phone numbers
 */

/**
 * Check if a phone number is an OAuth placeholder
 * OAuth placeholders start with "oauth_" prefix
 */
export function isOAuthPlaceholderPhone(phoneNumber: string): boolean {
  return phoneNumber.startsWith('oauth_');
}

/**
 * Generate unique phone number placeholder for OAuth users
 * Format: oauth_{userTypeId}_{timestamp}_{randomString}
 */
export function generateOAuthPhonePlaceholder(userTypeId: number): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 5);
  return `oauth_${userTypeId}_${timestamp}_${randomString}`;
}

/**
 * Get display-friendly phone number for OAuth users
 * Returns null for OAuth placeholders, actual number for real phone numbers
 */
export function getDisplayPhoneNumber(phoneNumber: string): string | null {
  return isOAuthPlaceholderPhone(phoneNumber) ? null : phoneNumber;
}

/**
 * Validate if a phone number can be used for login
 * OAuth placeholders cannot be used for phone-based login
 */
export function isValidLoginPhoneNumber(phoneNumber: string): boolean {
  return !isOAuthPlaceholderPhone(phoneNumber) && phoneNumber.length > 0;
}
