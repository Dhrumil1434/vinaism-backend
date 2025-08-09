import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { OAuthService } from './oauth.service';
import { OAuthUserProfile } from '../../../config/passport.config';
import { getDefaultUserTypeId } from './utils/userType.util';
import { OAUTH_SUCCESS_MESSAGES } from './oauth.constants';
import {
  validateUserTypeIdParam,
  validateOAuthProfile,
  validateUserAuthentication,
  validateProviderParam,
} from './validators/oauth.validators';
import {
  oauthInitiationSchemaDto,
  oauthLinkSchemaDto,
  oauthLoginApiResponseSchema,
  oauthManagementApiResponseSchema,
  oauthConnectionsApiResponseSchema,
} from './validators/oauth.dto';
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
      // Validate query parameters using DTO
      const validationResult = oauthInitiationSchemaDto.safeParse(req.query);

      let userTypeId: number;

      if (validationResult.success && validationResult.data.userTypeId) {
        // Validate userTypeId exists in database
        await validateUserTypeIdParam(validationResult.data.userTypeId);
        userTypeId = validationResult.data.userTypeId;
      } else {
        // Use default user type if none provided or validation failed
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

      // Validate OAuth profile exists
      validateOAuthProfile(userProfile);

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
      const loginResult = await OAuthService.handleOAuthLogin(
        userProfile,
        userAgent,
        ip,
        userTypeId || (await getDefaultUserTypeId())
      );

      // Clean up session
      delete (req.session as any).pendingUserTypeId;

      // Validate response using DTO
      const validatedResponse = oauthLoginApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: loginResult,
        message: OAUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
        success: true,
      });

      // Return validated response
      return res.status(validatedResponse.statusCode).json(validatedResponse);
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

      // Validate user authentication
      validateUserAuthentication(userId);

      // Validate request body using DTO
      const validatedData = oauthLinkSchemaDto.parse(req.body);

      // Link OAuth account to user
      const linkResult = await OAuthService.linkOAuthToUser(
        userId,
        validatedData
      );

      // Validate response using DTO
      const validatedResponse = oauthManagementApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: linkResult,
        message: linkResult.message,
        success: true,
      });

      return res.status(validatedResponse.statusCode).json(validatedResponse);
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

      // Validate user authentication
      validateUserAuthentication(userId);

      // Extract and validate provider from request parameters
      const { provider } = req.params;
      validateProviderParam(provider);

      // Unlink OAuth account
      const unlinkResult = await OAuthService.unlinkOAuthFromUser(
        userId,
        provider!
      );

      // Validate response using DTO
      const validatedResponse = oauthManagementApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: unlinkResult,
        message: unlinkResult.message,
        success: true,
      });

      return res.status(validatedResponse.statusCode).json(validatedResponse);
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

      // Validate user authentication
      validateUserAuthentication(userId);

      // Get user's OAuth connections
      const connectionsResult =
        await OAuthService.getUserOAuthConnections(userId);

      // Validate response using DTO
      const validatedResponse = oauthConnectionsApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: connectionsResult.data,
        message: connectionsResult.message,
        success: true,
      });

      return res.status(validatedResponse.statusCode).json(validatedResponse);
    }
  );
}
