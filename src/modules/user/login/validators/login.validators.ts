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

/**
 * Validate user exists and can login
 */
export const validateUserExists = async (
  email?: string,
  phoneNumber?: string
) => {
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
  hashedPassword: string
) => {
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
