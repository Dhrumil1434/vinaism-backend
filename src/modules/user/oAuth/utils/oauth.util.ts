import { IOAuthProfile } from '../oauth.types';
import { OAuthProvider } from '../validators/oauth.types';

/**
 * Transform OAuth profile data to standardized format
 */
export const transformOAuthProfile = (
  profile: any,
  provider: OAuthProvider
): IOAuthProfile => {
  switch (provider) {
    case 'google':
      return {
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: {
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
        },
        photos: profile.photos || [],
        provider,
      };

    case 'facebook':
      return {
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: {
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
        },
        photos: profile.photos || [],
        provider,
      };

    case 'apple':
      return {
        id: profile['id'],
        email: profile['email'] || '',
        name: {
          firstName: profile['name']?.firstName || '',
          lastName: profile['name']?.lastName || '',
        },
        photos: [],
        provider,
      };

    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

/**
 * Generate user data from OAuth profile
 */
export const generateUserDataFromOAuth = (profile: IOAuthProfile) => {
  const randomPassword = Math.random().toString(36).slice(-12);

  return {
    userName: profile.email || `user_${Date.now()}`,
    profilePicture: profile.photos?.[0]?.value || '',
    phoneNumber: '', // OAuth users might not have phone numbers initially
    email: profile.email || '',
    firstName: profile.name?.firstName || '',
    lastName: profile.name?.lastName || '',
    password: randomPassword,
    email_verified: true, // OAuth emails are typically verified
    phone_verified: false,
    admin_approved: true, // Configurable
  };
};

/**
 * Calculate token expiry date
 */
export const calculateTokenExpiry = (
  refreshToken?: string
): Date | undefined => {
  if (!refreshToken) return undefined;

  // 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

/**
 * Validate OAuth profile data
 */
export const validateOAuthProfile = (profile: IOAuthProfile): void => {
  if (!profile.id) {
    throw new Error('OAuth profile ID is required');
  }

  if (!profile.email) {
    throw new Error('OAuth profile email is required');
  }

  if (!profile.provider) {
    throw new Error('OAuth provider is required');
  }
};

/**
 * Format provider name for display
 */
export const formatProviderName = (provider: OAuthProvider): string => {
  switch (provider) {
    case 'google':
      return 'Google';
    case 'facebook':
      return 'Facebook';
    case 'apple':
      return 'Apple';
    default:
      return provider;
  }
};

/**
 * Check if OAuth provider is supported
 */
export const isSupportedProvider = (
  provider: string
): provider is OAuthProvider => {
  return ['google', 'facebook', 'apple'].includes(provider);
};
