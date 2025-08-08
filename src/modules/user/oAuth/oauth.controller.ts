import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@utils-core';

export class OAuthController {
  /**
   * Handle Google OAuth callback
   * This is called after Passport strategy processes the OAuth response
   *
   * Steps to implement:
   * 1. Extract user profile from req.user (set by Passport)
   * 2. Validate that user profile exists
   * 3. Call OAuthService.handleOAuthLogin with profile data
   * 4. Return success response with user data and JWT tokens
   * 5. Handle errors appropriately
   */
  static handleGoogleCallback = asyncHandler(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      // TODO: Implement Google OAuth callback handling
      // 1. Get user profile from req.user (Passport sets this)
      // 2. Validate profile exists
      // 3. Call OAuthService.handleOAuthLogin(profile, userAgent, ip)
      // 4. Return success response with user data and tokens
      // 5. Handle errors with proper status codes
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
    async (_req: Request, _res: Response, _next: NextFunction) => {
      // TODO: Implement OAuth account linking
      // 1. Extract provider, providerUserId, providerEmail, providerName, providerPicture from req.body
      // 2. Get userId from req.user (set by auth middleware)
      // 3. Call OAuthService.linkOAuthToUser(userId, oauthData)
      // 4. Return success response
      // 5. Handle missing parameters and validation errors
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
    async (_req: Request, _res: Response, _next: NextFunction) => {
      // TODO: Implement OAuth account unlinking
      // 1. Extract provider from req.params
      // 2. Get userId from req.user (set by auth middleware)
      // 3. Validate provider parameter exists
      // 4. Call OAuthService.unlinkOAuthFromUser(userId, provider)
      // 5. Return success response
      // 6. Handle errors (provider not linked, etc.)
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
    async (_req: Request, _res: Response, _next: NextFunction) => {
      // TODO: Implement get OAuth connections
      // 1. Get userId from req.user (set by auth middleware)
      // 2. Call OAuthService.getUserOAuthConnections(userId)
      // 3. Return list of OAuth connections
      // 4. Handle case where user has no OAuth connections
    }
  );
}
