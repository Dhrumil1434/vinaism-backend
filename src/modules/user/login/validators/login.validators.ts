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
  hashedPassword: string | null
) => {
  // Check if user is an OAuth user (no password set)
  if (hashedPassword === null || hashedPassword === undefined) {
    throw new ApiError(
      UserLoginAction.LOGIN_USER,
      StatusCodes.BAD_REQUEST,
      UserLoginErrorCode.INVALID_CREDENTIALS,
      'This account was created using OAuth (Google, Facebook, etc.). Please use OAuth login instead of email/password.',
      [
        {
          field: 'email',
          message:
            'This account was created using OAuth. Please use OAuth login instead.',
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
