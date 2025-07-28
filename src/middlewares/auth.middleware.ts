import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from 'modules/user/login/utils/auth.util';
import {
  COOKIE_CONFIG,
  UserLoginErrorCode,
  UserLoginMessage,
} from 'modules/user/login/login.constant';

/**
 * Middleware to authenticate JWT access token
 */
export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // First try to get token from Authorization header
    let token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    // If no token in header, try to get from cookie
    if (!token) {
      token = req.cookies?.[COOKIE_CONFIG.ACCESS_TOKEN_NAME];
    }

    if (!token) {
      throw new ApiError(
        'AUTHENTICATION',
        StatusCodes.UNAUTHORIZED,
        UserLoginErrorCode.TOKEN_MISSING,
        'Access token is required'
      );
    }

    // Verify the token
    const decoded = verifyAccessToken(token);

    // Attach user information to request
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(
        new ApiError(
          'AUTHENTICATION',
          StatusCodes.UNAUTHORIZED,
          UserLoginErrorCode.TOKEN_INVALID,
          UserLoginMessage.INVALID_ACCESS_TOKEN
        )
      );
    }
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      (req as any).user = {
        userId: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
      };
    }

    next();
  } catch {
    // Don't fail for optional auth, just continue without user info
    next();
  }
};

/**
 * Middleware to check if user has specific user type
 */
export const requireUserType = (requiredUserTypeId: number) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.UNAUTHORIZED,
          UserLoginErrorCode.TOKEN_MISSING,
          'Authentication required'
        )
      );
    }

    if (user.userType?.userTypeId !== requiredUserTypeId) {
      return next(
        new ApiError(
          'AUTHORIZATION',
          StatusCodes.FORBIDDEN,
          UserLoginErrorCode.INSUFFICIENT_PERMISSIONS,
          'Insufficient permissions'
        )
      );
    }

    next();
  };
};
