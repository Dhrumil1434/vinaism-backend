import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import {
  UserLoginAction,
  UserLoginErrorCode,
  UserLoginMessage,
} from '../login.constant';
import { LoginSchemaRepo } from '../loginSchema.repository';
import { verifyPassword } from '../utils/auth.util';
import { validateUserStatus } from '../utils/login.util';
import { isValidLoginPhoneNumber } from '../../oAuth/utils/phoneNumber.util.js';
import { OAuthSchemaRepo } from '../../oAuth/oauthSchema.repository';

/**
 * Validate user exists and can login
 */
export const validateUserExists = async (
  email?: string,
  phoneNumber?: string
) => {
  // Validate phone number is not an OAuth placeholder before attempting login
  if (phoneNumber && !isValidLoginPhoneNumber(phoneNumber)) {
    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.BAD_REQUEST,
      UserLoginErrorCode.INVALID_CREDENTIALS,
      'Phone number login not available for OAuth accounts. Please use email or OAuth login.',
      [
        {
          field: 'phoneNumber',
          message:
            'Phone number login not available for OAuth accounts. Please use email or OAuth login.',
        },
      ]
    );
  }

  const user = await LoginSchemaRepo.getUserByEmailOrPhone(email, phoneNumber);

  if (!user) {
    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.UNAUTHORIZED,
      UserLoginErrorCode.INVALID_CREDENTIALS,
      UserLoginMessage.LOGIN_FAILED,
      [
        {
          field: email ? 'email' : 'phoneNumber',
          message: UserLoginMessage.LOGIN_FAILED,
        },
      ]
    );
  }

  return user;
};

/**
 * Get OAuth providers for a user
 */
const getOAuthProviders = async (userId: number): Promise<string[]> => {
  try {
    const connections = await OAuthSchemaRepo.getUserOAuthConnections(userId);
    return connections.map((conn) => conn.provider);
  } catch (error) {
    console.error('Error fetching OAuth providers:', error);
    return [];
  }
};

/**
 * Validate user status for login
 */
export const validateUserStatusForLogin = async (user: any) => {
  try {
    validateUserStatus(user);
  } catch (error: any) {
    let errorCode = UserLoginErrorCode.ACCOUNT_INACTIVE;
    let message = UserLoginMessage.ACCOUNT_INACTIVE;

    if (error.message === 'Please verify your email first') {
      errorCode = UserLoginErrorCode.ACCOUNT_NOT_VERIFIED;
      message = UserLoginMessage.ACCOUNT_NOT_VERIFIED;
    } else if (error.message === 'Account is not approved by admin') {
      errorCode = UserLoginErrorCode.ACCOUNT_NOT_APPROVED;
      message = UserLoginMessage.ACCOUNT_NOT_APPROVED;
    }

    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.UNAUTHORIZED,
      errorCode,
      message,
      [
        {
          field: 'account',
          message: message,
        },
      ]
    );
  }
};

/**
 * Validate password
 */
export const validatePassword = async (
  inputPassword: string,
  hashedPassword: string | null,
  userId?: number
) => {
  // Check if user is an OAuth user (no password set)
  if (hashedPassword === null || hashedPassword === undefined) {
    // If userId is provided, check for specific OAuth providers
    if (userId) {
      const oauthProviders = await getOAuthProviders(userId);

      if (oauthProviders.length > 0) {
        const providerList = oauthProviders
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(', ');

        throw new ApiError(
          UserLoginAction.LOGIN_USER,
          StatusCodes.BAD_REQUEST,
          UserLoginErrorCode.INVALID_CREDENTIALS,
          `This account is linked to ${providerList}. Please use OAuth login instead of email/password.`,
          [
            {
              field: 'email',
              message: `This account uses ${providerList} login. Please use the social login button.`,
            },
          ]
        );
      }
    }

    // Fallback message if no OAuth providers found or no userId
    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.BAD_REQUEST,
      UserLoginErrorCode.INVALID_CREDENTIALS,
      'This account does not have a password set. Please contact support or use OAuth login.',
      [
        {
          field: 'email',
          message:
            'No password set for this account. Please use OAuth login or contact support.',
        },
      ]
    );
  }

  const isValid = await verifyPassword(inputPassword, hashedPassword);

  if (!isValid) {
    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.UNAUTHORIZED,
      UserLoginErrorCode.INVALID_CREDENTIALS,
      UserLoginMessage.LOGIN_FAILED,
      [
        {
          field: 'password',
          message: UserLoginMessage.LOGIN_FAILED,
        },
      ]
    );
  }
};
