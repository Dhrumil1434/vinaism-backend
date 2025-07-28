import { asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginService } from './login.service';
import {
  UserLoginMessage,
  UserLoginErrorCode,
  COOKIE_CONFIG,
  UserLoginConfig,
} from './login.constant';
import {
  loginApiResponseSchema,
  refreshTokenApiResponseSchema,
  logoutApiResponseSchema,
} from './validators/login.dto';

export class LoginController {
  /**
   * Login user with email/phone and password
   */
  static loginUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Validation is already handled by middleware, so req.body is already validated
      const loginData = req.body;

      // Extract user agent and IP address for security tracking
      const userAgent = req.headers['user-agent'];
      const ipAddress =
        req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

      // Call the login service
      const loginResult = await LoginService.loginUser(
        loginData,
        userAgent,
        ipAddress
      );

      // Validate response using DTO
      const validatedResponse = loginApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: loginResult,
        message: UserLoginMessage.LOGIN_SUCCESS,
        success: true,
      });

      // Set refresh token as HTTP-only cookie
      res.cookie(
        COOKIE_CONFIG.REFRESH_TOKEN_NAME,
        validatedResponse.data.tokens.refreshToken,
        {
          httpOnly: COOKIE_CONFIG.REFRESH_TOKEN_HTTP_ONLY,
          secure: COOKIE_CONFIG.REFRESH_TOKEN_SECURE,
          sameSite: COOKIE_CONFIG.REFRESH_TOKEN_SAME_SITE,
          maxAge: UserLoginConfig.REFRESH_TOKEN_EXPIRY_MS as number,
          path: COOKIE_CONFIG.REFRESH_TOKEN_PATH,
        }
      );

      // Set access token as regular cookie (accessible by JavaScript)
      res.cookie(
        COOKIE_CONFIG.ACCESS_TOKEN_NAME,
        validatedResponse.data.tokens.accessToken,
        {
          httpOnly: COOKIE_CONFIG.ACCESS_TOKEN_HTTP_ONLY,
          secure: COOKIE_CONFIG.ACCESS_TOKEN_SECURE,
          sameSite: COOKIE_CONFIG.ACCESS_TOKEN_SAME_SITE,
          maxAge: UserLoginConfig.ACCESS_TOKEN_EXPIRY_SECONDS * 1000, // Convert to milliseconds
          path: COOKIE_CONFIG.ACCESS_TOKEN_PATH,
        }
      );

      // Return both tokens in response (for backward compatibility)
      res.status(validatedResponse.statusCode).json(validatedResponse);
    }
  );

  /**
   * Refresh access token using cookie
   */
  static refreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get refresh token from cookie
      const refreshToken = req.cookies?.[COOKIE_CONFIG.REFRESH_TOKEN_NAME];

      if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusCode: StatusCodes.UNAUTHORIZED,
          data: null,
          message: UserLoginMessage.REFRESH_TOKEN_NOT_FOUND,
          success: false,
          errorCode: UserLoginErrorCode.REFRESH_TOKEN_NOT_FOUND,
        });
      }

      const { accessToken } = await LoginService.refreshToken(refreshToken);

      // Set new access token as cookie
      res.cookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: COOKIE_CONFIG.ACCESS_TOKEN_HTTP_ONLY,
        secure: COOKIE_CONFIG.ACCESS_TOKEN_SECURE,
        sameSite: COOKIE_CONFIG.ACCESS_TOKEN_SAME_SITE,
        maxAge: UserLoginConfig.ACCESS_TOKEN_EXPIRY_SECONDS * 1000,
        path: COOKIE_CONFIG.ACCESS_TOKEN_PATH,
      });

      // Validate response using DTO
      const validatedResponse = refreshTokenApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { accessToken },
        message: UserLoginMessage.TOKEN_REFRESHED,
        success: true,
      });

      res.status(validatedResponse.statusCode).json(validatedResponse);
    }
  );

  /**
   * Logout user using cookie
   */
  static logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get refresh token from cookie
      const refreshToken = req.cookies?.[COOKIE_CONFIG.REFRESH_TOKEN_NAME];

      if (refreshToken) {
        await LoginService.logout(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie(COOKIE_CONFIG.REFRESH_TOKEN_NAME, {
        path: COOKIE_CONFIG.REFRESH_TOKEN_PATH,
        httpOnly: COOKIE_CONFIG.REFRESH_TOKEN_HTTP_ONLY,
        secure: COOKIE_CONFIG.REFRESH_TOKEN_SECURE,
        sameSite: COOKIE_CONFIG.REFRESH_TOKEN_SAME_SITE,
      });

      // Clear access token cookie
      res.clearCookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, {
        path: COOKIE_CONFIG.ACCESS_TOKEN_PATH,
        httpOnly: COOKIE_CONFIG.ACCESS_TOKEN_HTTP_ONLY,
        secure: COOKIE_CONFIG.ACCESS_TOKEN_SECURE,
        sameSite: COOKIE_CONFIG.ACCESS_TOKEN_SAME_SITE,
      });

      // Validate response using DTO
      const validatedResponse = logoutApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: null,
        message: UserLoginMessage.LOGOUT_SUCCESS,
        success: true,
      });

      res.status(validatedResponse.statusCode).json(validatedResponse);
    }
  );

  /**
   * Logout user from all sessions
   */
  static logoutFromAllSessions = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusCode: StatusCodes.UNAUTHORIZED,
          data: null,
          message: 'User not authenticated',
          success: false,
        });
      }

      await LoginService.logoutFromAllSessions(userId);

      // Clear refresh token cookie
      res.clearCookie(COOKIE_CONFIG.REFRESH_TOKEN_NAME, {
        path: COOKIE_CONFIG.REFRESH_TOKEN_PATH,
        httpOnly: COOKIE_CONFIG.REFRESH_TOKEN_HTTP_ONLY,
        secure: COOKIE_CONFIG.REFRESH_TOKEN_SECURE,
        sameSite: COOKIE_CONFIG.REFRESH_TOKEN_SAME_SITE,
      });

      // Clear access token cookie
      res.clearCookie(COOKIE_CONFIG.ACCESS_TOKEN_NAME, {
        path: COOKIE_CONFIG.ACCESS_TOKEN_PATH,
        httpOnly: COOKIE_CONFIG.ACCESS_TOKEN_HTTP_ONLY,
        secure: COOKIE_CONFIG.ACCESS_TOKEN_SECURE,
        sameSite: COOKIE_CONFIG.ACCESS_TOKEN_SAME_SITE,
      });

      // Validate response using DTO
      const validatedResponse = logoutApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: null,
        message: 'Logged out from all sessions successfully',
        success: true,
      });

      res.status(validatedResponse.statusCode).json(validatedResponse);
    }
  );

  /**
   * Get user's active sessions
   */
  static getUserActiveSessions = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusCode: StatusCodes.UNAUTHORIZED,
          data: null,
          message: 'User not authenticated',
          success: false,
        });
      }

      const sessions = await LoginService.getUserActiveSessions(userId);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: sessions,
        message: 'Active sessions retrieved successfully',
        success: true,
      });
    }
  );
}
