import { ILoginCredentials, ILoginResponse } from './login.types';
import { LoginSchemaRepo } from './loginSchema.repository';
import { generateAccessToken, generateRefreshToken } from './utils/auth.util';
import {
  transformUserForLogin,
  calculateLockoutTime,
} from './utils/login.util';
import {
  validateUserExists,
  validateUserStatusForLogin,
  validatePassword,
} from './validators/login.validators';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import {
  UserLoginAction,
  UserLoginErrorCode,
  UserLoginMessage,
  UserLoginConfig,
} from './login.constant';

export class LoginService {
  /**
   * Login user with email/phone and password
   */
  static async loginUser(
    credentials: ILoginCredentials,
    userAgent?: string,
    ipAddress?: string
  ): Promise<ILoginResponse> {
    try {
      // 1. Find user by email or phone number
      const user = await validateUserExists(
        credentials.email,
        credentials.phoneNumber
      );

      // 2. Check if account is locked (don't auto-unlock)
      const isLocked = await LoginSchemaRepo.isAccountLocked(user.userId);

      if (isLocked) {
        throw new ApiError(
          UserLoginAction.LOGIN_USER,
          StatusCodes.TOO_MANY_REQUESTS,
          UserLoginErrorCode.TOO_MANY_ATTEMPTS,
          UserLoginMessage.TOO_MANY_ATTEMPTS,
          [
            {
              field: 'account',
              message: UserLoginMessage.TOO_MANY_ATTEMPTS,
            },
          ]
        );
      }

      // 3. Validate user status (email verified, admin approved, etc.)
      await validateUserStatusForLogin(user);

      // 4. Verify password
      await validatePassword(credentials.password, user.password!);

      // 5. Generate tokens with user type information
      const accessToken = await generateAccessToken({
        userId: user.userId,
        email: user.email,
        userTypeId: user.userType!,
      });

      const refreshToken = generateRefreshToken(user.userId);

      // 6. Store refresh token and update last login
      await Promise.all([
        LoginSchemaRepo.storeRefreshToken(
          user.userId,
          refreshToken,
          userAgent,
          ipAddress
        ),
        LoginSchemaRepo.updateLastLogin(user.userId),
        LoginSchemaRepo.resetLoginAttempts(user.userId),
      ]);

      // 7. Transform user data for response
      const transformedUser = await transformUserForLogin(user);

      // 8. Return login response
      return {
        user: transformedUser,
        tokens: {
          accessToken,
          refreshToken,
        },
        expiresIn: UserLoginConfig.ACCESS_TOKEN_EXPIRY_SECONDS as number,
      };
    } catch (error) {
      // Handle failed login attempts
      if (
        error instanceof ApiError &&
        error.errorCode === UserLoginErrorCode.INVALID_CREDENTIALS
      ) {
        const user = await LoginSchemaRepo.getUserByEmailOrPhone(
          credentials.email,
          credentials.phoneNumber
        );
        if (user) {
          const isNowLocked = await this.handleFailedLogin(
            user.userId,
            ipAddress,
            userAgent
          );

          // If account got locked after this failed attempt, throw TOO_MANY_ATTEMPTS error
          if (isNowLocked) {
            throw new ApiError(
              UserLoginAction.LOGIN_USER,
              StatusCodes.TOO_MANY_REQUESTS,
              UserLoginErrorCode.TOO_MANY_ATTEMPTS,
              UserLoginMessage.TOO_MANY_ATTEMPTS,
              [
                {
                  field: 'account',
                  message: UserLoginMessage.TOO_MANY_ATTEMPTS,
                },
              ]
            );
          }
        }
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      // 1. Verify refresh token
      const { verifyRefreshToken } = await import('./utils/auth.util');
      const decoded = verifyRefreshToken(refreshToken);

      // 2. Check if refresh token exists in database
      const isValidToken = await LoginSchemaRepo.validateRefreshToken(
        decoded.userId,
        refreshToken
      );
      if (!isValidToken) {
        throw new ApiError(
          UserLoginAction.REFRESH_TOKEN,
          StatusCodes.UNAUTHORIZED,
          UserLoginErrorCode.TOKEN_INVALID,
          UserLoginMessage.INVALID_REFRESH_TOKEN
        );
      }

      // 3. Get user details
      const user = await LoginSchemaRepo.getUserById(decoded.userId);
      if (!user) {
        throw new ApiError(
          UserLoginAction.REFRESH_TOKEN,
          StatusCodes.UNAUTHORIZED,
          UserLoginErrorCode.USER_NOT_FOUND,
          UserLoginMessage.USER_NOT_FOUND
        );
      }

      // 4. Generate new access token with user type information
      const accessToken = await generateAccessToken({
        userId: user.userId,
        email: user.email,
        userTypeId: user.userType!,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        UserLoginAction.REFRESH_TOKEN,
        StatusCodes.UNAUTHORIZED,
        UserLoginErrorCode.TOKEN_EXPIRED,
        UserLoginMessage.REFRESH_TOKEN_EXPIRED
      );
    }
  }

  /**
   * Logout user by invalidating refresh token
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      // 1. Verify refresh token to get user ID
      const { verifyRefreshToken } = await import('./utils/auth.util');
      const decoded = verifyRefreshToken(refreshToken);

      // 2. Remove refresh token from database
      await LoginSchemaRepo.removeRefreshToken(decoded.userId, refreshToken);
    } catch (error) {
      // Even if token is invalid, we consider logout successful
      console.log('Logout with invalid token:', error);
    }
  }

  /**
   * Logout user from all sessions
   */
  static async logoutFromAllSessions(userId: number): Promise<void> {
    await LoginSchemaRepo.removeRefreshToken(userId);
  }

  /**
   * Get user's active sessions
   */
  static async getUserActiveSessions(userId: number) {
    return await LoginSchemaRepo.getActiveSessionsByUserId(userId);
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    return await LoginSchemaRepo.cleanupExpiredSessions();
  }

  /**
   * Handle failed login attempts
   */
  private static async handleFailedLogin(
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    const user = await LoginSchemaRepo.getUserById(userId);
    if (!user) return false;

    // Check if account was previously locked but lockout has expired

    await LoginSchemaRepo.isAccountLockedAndUnlockIfExpired(userId);

    // Get current attempt count (might be reset to 0 if lockout expired)
    const currentAttempts = await LoginSchemaRepo.getAttemptCount(userId);
    const newAttempts = currentAttempts + 1;

    if (newAttempts >= UserLoginConfig.MAX_LOGIN_ATTEMPTS) {
      // Lock account (this also increments attempts)
      const lockoutTime = calculateLockoutTime(newAttempts);
      console.log(
        `   🔒 Locking account with lockout until: ${lockoutTime.toISOString()}`
      );
      await LoginSchemaRepo.lockAccount(
        userId,
        lockoutTime,
        ipAddress,
        userAgent
      );
      return true; // Account is now locked
    } else {
      await LoginSchemaRepo.incrementLoginAttempts(
        userId,
        ipAddress,
        userAgent
      );
      return false; // Account is not locked yet
    }
  }
}
