import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@utils-core';
import { OAuthService } from './oauth.service';
import { OAuthUserProfile } from '../../../config/passport.config';
import { IOAuthLinkRequest } from './oauth.types';
import {
  validateUserTypeId,
  getDefaultUserTypeId,
} from './utils/userType.util';
import passport from '../../../config/passport.config';

export class OAuthController {
  /**
   * Initiate Google OAuth with optional userTypeId parameter
   *
   * URL format: /api/auth/google?userTypeId=32
   *
   * Steps:
   * 1. Extract and validate userTypeId from query params
   * 2. Store userTypeId in session for callback use
   * 3. Redirect to Google OAuth
   */
  static initiateGoogleOAuth = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userTypeIdParam = req.query['userTypeId'] as string;
      let userTypeId: number;

      // Validate userTypeId parameter
      if (userTypeIdParam) {
        const parsedUserTypeId = parseInt(userTypeIdParam, 10);

        if (isNaN(parsedUserTypeId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid userTypeId. Must be a number.',
          });
        }

        const isValid = await validateUserTypeId(parsedUserTypeId);
        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: `Invalid userTypeId: ${parsedUserTypeId}. User type does not exist.`,
          });
        }

        userTypeId = parsedUserTypeId;
      } else {
        // Use default user type if none provided
        userTypeId = await getDefaultUserTypeId();
      }

      // Store userTypeId in session for use in callback
      (req.session as any).pendingUserTypeId = userTypeId;

      // Proceed with Google OAuth
      return passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
      })(req, res, _next);
    }
  );

  /**
   * Handle Google OAuth callback
   * This is called after Passport strategy processes the OAuth response
   *
   * Steps to implement:
   * 1. Extract user profile from req.user (set by Passport)
   * 2. Get userTypeId from session
   * 3. Validate that user profile exists
   * 4. Call OAuthService.handleOAuthLogin with profile data and userTypeId
   * 5. Return success response with user data and JWT tokens
   * 6. Handle errors appropriately
   */
  static handleGoogleCallback = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get user profile from req.user (set by Passport)
      const userProfile = req.user as OAuthUserProfile;

      if (!userProfile) {
        return res.status(400).json({
          success: false,
          message: 'OAuth authentication failed - no user profile received',
        });
      }

      // Get userTypeId from session (set during initiation)
      const userTypeId = (req.session as any).pendingUserTypeId;

      if (!userTypeId) {
        // Fallback to default if session doesn't have userTypeId
        const defaultUserTypeId = await getDefaultUserTypeId();
        console.warn(
          'No userTypeId in session, using default:',
          defaultUserTypeId
        );
      }

      // Extract request metadata
      const userAgent = req.get('User-Agent');
      const ip = req.ip || req.connection.remoteAddress;

      // Process OAuth login through service with userTypeId
      const result = await OAuthService.handleOAuthLogin(
        userProfile,
        userAgent,
        ip,
        userTypeId || (await getDefaultUserTypeId())
      );

      // Clean up session
      delete (req.session as any).pendingUserTypeId;

      // Return success response with user data
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    }
  );

  /**
   * Link OAuth account to existing user
   *
   * Steps to implement:
   * 1. Extract OAuth data from request body (provider, providerUserId, etc.)
   * 2. Get userId from authenticated user (req.user from auth middleware)
   * 3. Call OAuthService.linkOAuthToUser with userId and OAuth data
   * 4. Return success response
   * 5. Handle validation errors
   */
  static linkOAuthAccount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get userId from authenticated user (requires auth middleware)
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Extract OAuth data from request body
      const oauthData: IOAuthLinkRequest = req.body;

      if (!oauthData.provider || !oauthData.providerUserId) {
        return res.status(400).json({
          success: false,
          message: 'Provider and providerUserId are required',
        });
      }

      // Link OAuth account to user
      const result = await OAuthService.linkOAuthToUser(userId, oauthData);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    }
  );

  /**
   * Unlink OAuth account from user
   *
   * Steps to implement:
   * 1. Extract provider from request parameters
   * 2. Get userId from authenticated user
   * 3. Validate provider parameter exists
   * 4. Call OAuthService.unlinkOAuthFromUser with userId and provider
   * 5. Return success response
   * 6. Handle errors (provider not found, etc.)
   */
  static unlinkOAuthAccount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get userId from authenticated user (requires auth middleware)
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Extract provider from request parameters
      const { provider } = req.params;

      if (!provider) {
        return res.status(400).json({
          success: false,
          message: 'Provider parameter is required',
        });
      }

      // Unlink OAuth account
      const result = await OAuthService.unlinkOAuthFromUser(userId, provider);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    }
  );

  /**
   * Get user's OAuth connections
   *
   * Steps to implement:
   * 1. Get userId from authenticated user
   * 2. Call OAuthService.getUserOAuthConnections with userId
   * 3. Return list of OAuth connections
   * 4. Handle empty results appropriately
   */
  static getOAuthConnections = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Get userId from authenticated user (requires auth middleware)
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Get user's OAuth connections
      const result = await OAuthService.getUserOAuthConnections(userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    }
  );
}
