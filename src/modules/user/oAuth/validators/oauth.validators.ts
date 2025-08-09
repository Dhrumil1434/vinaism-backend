import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { OAuthAction, OAuthErrorCode } from '../oauth.constants';
import { validateUserTypeId } from '../utils/userType.util';

/**
 * Validate userTypeId parameter
 */
export const validateUserTypeIdParam = async (
  userTypeId: number
): Promise<void> => {
  const isValid = await validateUserTypeId(userTypeId);

  if (!isValid) {
    throw new ApiError(
      OAuthAction.OAUTH_LOGIN,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_AUTHENTICATION_FAILED,
      `Invalid userTypeId: ${userTypeId}. User type does not exist.`
    );
  }
};

/**
 * Validate OAuth profile exists
 */
export const validateOAuthProfile = (profile: any): void => {
  if (!profile) {
    throw new ApiError(
      OAuthAction.OAUTH_CALLBACK,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_AUTHENTICATION_FAILED,
      'OAuth authentication failed - no user profile received'
    );
  }
};

/**
 * Validate user authentication (for OAuth management endpoints)
 */
export const validateUserAuthentication = (userId: any): void => {
  if (!userId) {
    throw new ApiError(
      OAuthAction.OAUTH_LINK,
      StatusCodes.UNAUTHORIZED,
      OAuthErrorCode.OAUTH_AUTHENTICATION_FAILED,
      'Authentication required'
    );
  }
};

/**
 * Validate provider parameter
 */
export const validateProviderParam = (provider: string | undefined): void => {
  if (!provider) {
    throw new ApiError(
      OAuthAction.OAUTH_UNLINK,
      StatusCodes.BAD_REQUEST,
      OAuthErrorCode.OAUTH_AUTHENTICATION_FAILED,
      'Provider parameter is required'
    );
  }
};
