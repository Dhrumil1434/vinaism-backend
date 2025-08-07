import { OAuthProvider } from './oauth.types';
import { OAuthSchemaRepo } from '../oauthSchema.repository';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { OAuthAction, OAuthErrorCode, OAuthMessage } from '../oauth.constants';

// Define the interface locally since oauth.types.ts was deleted
interface IOAuthProfile {
  id: string;
  email: string;
  name?: {
    firstName?: string;
    lastName?: string;
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
  provider: OAuthProvider;
}

/**
 * Validate OAuth provider
 */
export const validateOAuthProvider = (provider: string): OAuthProvider => {
  if (!['google', 'facebook', 'apple'].includes(provider)) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_PROVIDER_ERROR,
      OAuthMessage.OAUTH_PROVIDER_ERROR,
      [
        {
          field: 'provider',
          message: 'Invalid OAuth provider',
        },
      ]
    );
  }
  return provider as OAuthProvider;
};

/**
 * Validate OAuth profile data
 */
export const validateOAuthProfile = (profile: IOAuthProfile): void => {
  if (!profile.id) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_ERROR,
      'OAuth profile ID is required',
      [
        {
          field: 'profile.id',
          message: 'OAuth profile ID is required',
        },
      ]
    );
  }

  if (!profile.email) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_ERROR,
      'OAuth profile email is required',
      [
        {
          field: 'profile.email',
          message: 'OAuth profile email is required',
        },
      ]
    );
  }

  if (!profile.provider) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_ERROR,
      'OAuth provider is required',
      [
        {
          field: 'profile.provider',
          message: 'OAuth provider is required',
        },
      ]
    );
  }
};

/**
 * Check if OAuth account already exists
 */
export const validateOAuthAccountExists = async (
  provider: OAuthProvider,
  providerUserId: string
) => {
  const existingOAuth = await OAuthSchemaRepo.findByProviderAndUserId(
    provider,
    providerUserId
  );

  if (existingOAuth) {
    throw new ApiError(
      OAuthAction.OAUTH_LINK,
      StatusCodes.CONFLICT,
      OAuthErrorCode.OAUTH_ACCOUNT_IN_USE,
      OAuthMessage.OAUTH_ACCOUNT_IN_USE,
      [
        {
          field: 'oauth_account',
          message: OAuthMessage.OAUTH_ACCOUNT_IN_USE,
        },
      ]
    );
  }

  return existingOAuth;
};

/**
 * Check if user already has OAuth connection for provider
 */
export const validateUserOAuthConnection = async (
  userId: number,
  provider: OAuthProvider
) => {
  const existingConnection = await OAuthSchemaRepo.findByUserIdAndProvider(
    userId,
    provider
  );

  if (existingConnection) {
    throw new ApiError(
      OAuthAction.OAUTH_LINK,
      StatusCodes.CONFLICT,
      OAuthErrorCode.OAUTH_ALREADY_LINKED,
      OAuthMessage.OAUTH_ALREADY_LINKED,
      [
        {
          field: 'oauth_connection',
          message: OAuthMessage.OAUTH_ALREADY_LINKED,
        },
      ]
    );
  }

  return existingConnection;
};

/**
 * Validate user exists for OAuth linking
 */
export const validateUserExistsForOAuth = async () => {
  // This would typically check if the user exists in the users table
  // For now, we'll assume the user exists if we reach this point
  // You can add actual user validation here if needed
  return true;
};

/**
 * Validate OAuth tokens
 */
export const validateOAuthTokens = (accessToken: string): void => {
  if (!accessToken) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_ERROR,
      'OAuth access token is required',
      [
        {
          field: 'accessToken',
          message: 'OAuth access token is required',
        },
      ]
    );
  }

  // Additional token validation can be added here
  // For example, checking token format, expiry, etc.
};
