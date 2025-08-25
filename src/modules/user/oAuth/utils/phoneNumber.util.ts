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
 * Handle phone number for OAuth user creation
 * Returns actual phone if provided by OAuth provider, otherwise generates placeholder
 */
export function handleOAuthPhoneNumber(
  providerPhoneNumber: string | undefined | null,
  userTypeId: number
): { phoneNumber: string; isRealPhone: boolean } {
  // If OAuth provider gave us a real phone number, use it
  if (providerPhoneNumber && providerPhoneNumber.trim() !== '') {
    return {
      phoneNumber: providerPhoneNumber.trim(),
      isRealPhone: true,
    };
  }

  // Otherwise, generate unique placeholder to avoid DB constraint violations
  return {
    phoneNumber: generateOAuthPhonePlaceholder(userTypeId),
    isRealPhone: false,
  };
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

/**
 * Validate phone number format for verification
 * Accepts international and local formats with common separators
 */
export function isValidPhoneNumberFormat(phoneNumber: string): boolean {
  // Remove all non-digit characters for validation
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid length (10-15 digits)
  if (cleanNumber.length < 10 || cleanNumber.length > 15) {
    return false;
  }

  // Check if it contains only valid characters (digits, spaces, dashes, parentheses, plus)
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Clean and format phone number for storage
 * Removes unnecessary characters and standardizes format
 */
export function cleanPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except plus sign
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Ensure it starts with + if it's an international number
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // For local numbers, add country code if not present
  // This is a basic implementation - you might want to make this configurable
  if (cleaned.length === 10) {
    // Assuming US/Canada format, add +1
    return `+1${cleaned}`;
  }

  return cleaned;
}

/**
 * Check if phone number is different from current user phone
 * Useful for determining if phone update is needed
 */
export function isPhoneNumberChanged(
  currentPhone: string,
  newPhone: string
): boolean {
  const cleanCurrent = cleanPhoneNumber(currentPhone);
  const cleanNew = cleanPhoneNumber(newPhone);
  return cleanCurrent !== cleanNew;
}
