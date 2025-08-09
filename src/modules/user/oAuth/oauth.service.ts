import { OAuthSchemaRepo } from './oauthSchema.repository';
import { OAUTH_SUCCESS_MESSAGES, OAuthConfig } from './oauth.constants';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { OAuthUserProfile } from '../../../config/passport.config';
import { OAuthAction, OAuthErrorCode, OAuthMessage } from './oauth.constants';
import {
  IOAuthLoginResponse,
  IOAuthUser,
  IOAuthMetadata,
  IOAuthResponse,
} from './oauth.types';

export class OAuthService {
  /**
   * Handle OAuth login - main entry point for OAuth authentication
   *
   * This method:
   * 1. Checks if OAuth account already exists
   * 2. If exists, logs in the existing user
   * 3. If not exists, checks if user exists by email
   * 4. Creates new user if needed
   * 5. Links OAuth account to user
   * 6. Returns complete user data
   */
  static async handleOAuthLogin(
    profile: OAuthUserProfile,
    _userAgent?: string,
    _ip?: string,
    userTypeId?: number
  ): Promise<IOAuthLoginResponse> {
    try {
      // Step 1: Check if OAuth account already exists
      const existingOAuth = await OAuthSchemaRepo.findByProviderAndUserId(
        profile.provider,
        profile.providerId
      );

      if (existingOAuth) {
        // OAuth account exists - get the associated user
        const user = await OAuthSchemaRepo.getUserByOAuthId(existingOAuth.id!);

        if (!user) {
          throw new ApiError(
            OAuthAction.OAUTH_LOGIN,
            StatusCodes.NOT_FOUND,
            OAuthErrorCode.OAUTH_USER_NOT_FOUND,
            OAuthMessage.OAUTH_USER_NOT_FOUND
          );
        }

        // Update OAuth tokens if provided
        if (profile.accessToken) {
          const tokenData = {
            accessToken: profile.accessToken,
            tokenExpiresAt: new Date(
              Date.now() + OAuthConfig.ACCESS_TOKEN_EXPIRY_SECONDS * 1000
            ),
            ...(profile.refreshToken && { refreshToken: profile.refreshToken }),
          };
          await OAuthSchemaRepo.updateOAuthTokens(existingOAuth.id!, tokenData);
        }

        const transformedUser: IOAuthUser = {
          userId: user.users.userId,
          userName: user.users.userName,
          email: user.users.email,
          firstName: user.users.firstName,
          lastName: user.users.lastName,
          profilePicture: user.users.profilePicture,
          userType: user.users.userType!,
          emailVerified: user.users.email_verified,
          adminApproved: user.users.admin_approved,
        };

        const transformedOAuth: IOAuthMetadata = {
          provider: user.oauth_metadata.provider,
          providerEmail: user.oauth_metadata.providerEmail || undefined,
          connectedAt: user.oauth_metadata.createdAt,
        };

        return {
          user: transformedUser,
          oauth: transformedOAuth,
          isNewUser: false,
          message: OAUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
        };
      }

      // Step 2: OAuth account doesn't exist - check if user exists by email
      let user = null;
      if (profile.email) {
        user = await OAuthSchemaRepo.findUserByEmail(profile.email);
      }

      // Step 3: Create new user if doesn't exist
      if (!user) {
        if (!profile.email) {
          throw new ApiError(
            OAuthAction.OAUTH_REGISTRATION,
            StatusCodes.BAD_REQUEST,
            OAuthErrorCode.OAUTH_AUTHENTICATION_FAILED,
            'Email is required for OAuth registration'
          );
        }

        const userCreateData = {
          email: profile.email,
          userType: userTypeId || OAuthConfig.DEFAULT_USER_TYPE_ID,
          ...(profile.firstName && { firstName: profile.firstName }),
          ...(profile.lastName && { lastName: profile.lastName }),
          ...(profile.picture && { profilePicture: profile.picture }),
        };
        await OAuthSchemaRepo.createUser(userCreateData);

        // Get the created user
        user = await OAuthSchemaRepo.findUserByEmail(profile.email);

        if (!user) {
          throw new ApiError(
            OAuthAction.OAUTH_REGISTRATION,
            StatusCodes.INTERNAL_SERVER_ERROR,
            OAuthErrorCode.OAUTH_CREATION_FAILED,
            OAuthMessage.OAUTH_CREATION_FAILED
          );
        }
      }

      // Step 4: Create OAuth record for the user
      const oauthData = {
        userId: user.userId,
        provider: profile.provider,
        providerUserId: profile.providerId,
        ...(profile.email && { providerEmail: profile.email }),
        ...(profile.displayName && { providerName: profile.displayName }),
        ...(profile.picture && { providerPicture: profile.picture }),
        ...(profile.accessToken && { accessToken: profile.accessToken }),
        ...(profile.refreshToken && { refreshToken: profile.refreshToken }),
        ...(profile.accessToken && {
          tokenExpiresAt: new Date(
            Date.now() + OAuthConfig.ACCESS_TOKEN_EXPIRY_SECONDS * 1000
          ),
        }),
      };

      await OAuthSchemaRepo.createOAuthRecord(oauthData);

      // Get the complete user data with OAuth info
      const completeUserData = await OAuthSchemaRepo.findByProviderAndUserId(
        profile.provider,
        profile.providerId
      );

      const transformedUser: IOAuthUser = {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        userType: user.userType!,
        emailVerified: user.email_verified,
        adminApproved: user.admin_approved,
      };

      const transformedOAuth: IOAuthMetadata = {
        provider: completeUserData?.provider || profile.provider,
        providerEmail: completeUserData?.providerEmail || profile.email,
        connectedAt: completeUserData?.createdAt,
      };

      return {
        user: transformedUser,
        oauth: transformedOAuth,
        isNewUser: true,
        message: OAUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      console.error('OAuth Service Error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        OAuthAction.OAUTH_LOGIN,
        StatusCodes.INTERNAL_SERVER_ERROR,
        OAuthErrorCode.OAUTH_ERROR,
        OAuthMessage.OAUTH_ERROR
      );
    }
  }

  /**
   * Link OAuth account to existing authenticated user
   */
  static async linkOAuthToUser(
    userId: number,
    oauthData: {
      provider: string;
      providerUserId: string;
      providerEmail?: string;
      providerName?: string;
      providerPicture?: string;
      accessToken?: string;
      refreshToken?: string;
    }
  ): Promise<IOAuthResponse> {
    try {
      // Check if OAuth account is already linked to any user
      const existingOAuth = await OAuthSchemaRepo.findByProviderAndUserId(
        oauthData.provider,
        oauthData.providerUserId
      );

      if (existingOAuth) {
        throw new ApiError(
          OAuthAction.OAUTH_LINK,
          StatusCodes.CONFLICT,
          OAuthErrorCode.OAUTH_ACCOUNT_IN_USE,
          OAuthMessage.OAUTH_ACCOUNT_IN_USE
        );
      }

      // Check if user already has this provider linked
      const hasConnection = await OAuthSchemaRepo.hasOAuthConnection(
        userId,
        oauthData.provider
      );

      if (hasConnection) {
        throw new ApiError(
          OAuthAction.OAUTH_LINK,
          StatusCodes.CONFLICT,
          OAuthErrorCode.OAUTH_ALREADY_LINKED,
          OAuthMessage.OAUTH_ALREADY_LINKED
        );
      }

      // Create OAuth record
      const cleanOAuthData = {
        userId,
        provider: oauthData.provider,
        providerUserId: oauthData.providerUserId,
        ...(oauthData.providerEmail && {
          providerEmail: oauthData.providerEmail,
        }),
        ...(oauthData.providerName && { providerName: oauthData.providerName }),
        ...(oauthData.providerPicture && {
          providerPicture: oauthData.providerPicture,
        }),
        ...(oauthData.accessToken && { accessToken: oauthData.accessToken }),
        ...(oauthData.refreshToken && { refreshToken: oauthData.refreshToken }),
        ...(oauthData.accessToken && {
          tokenExpiresAt: new Date(
            Date.now() + OAuthConfig.ACCESS_TOKEN_EXPIRY_SECONDS * 1000
          ),
        }),
      };
      await OAuthSchemaRepo.createOAuthRecord(cleanOAuthData);

      return {
        success: true,
        message: OAUTH_SUCCESS_MESSAGES.ACCOUNT_LINKED,
      };
    } catch (error) {
      console.error('OAuth Linking Error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        OAuthAction.OAUTH_LINK,
        StatusCodes.INTERNAL_SERVER_ERROR,
        OAuthErrorCode.OAUTH_LINKING_FAILED,
        OAuthMessage.OAUTH_LINKING_FAILED
      );
    }
  }

  /**
   * Unlink OAuth account from user
   */
  static async unlinkOAuthFromUser(
    userId: number,
    provider: string
  ): Promise<IOAuthResponse> {
    try {
      // Check if connection exists
      const hasConnection = await OAuthSchemaRepo.hasOAuthConnection(
        userId,
        provider
      );

      if (!hasConnection) {
        throw new ApiError(
          OAuthAction.OAUTH_UNLINK,
          StatusCodes.NOT_FOUND,
          OAuthErrorCode.OAUTH_NOT_LINKED,
          OAuthMessage.OAUTH_NOT_LINKED
        );
      }

      // Soft delete OAuth record
      await OAuthSchemaRepo.deleteOAuthRecord(userId, provider);

      return {
        success: true,
        message: OAUTH_SUCCESS_MESSAGES.OAUTH_ACCOUNT_UNLINKED,
      };
    } catch (error) {
      console.error('OAuth Unlinking Error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        OAuthAction.OAUTH_UNLINK,
        StatusCodes.INTERNAL_SERVER_ERROR,
        OAuthErrorCode.OAUTH_UNLINKING_FAILED,
        OAuthMessage.OAUTH_UNLINKING_FAILED
      );
    }
  }

  /**
   * Get user's OAuth connections
   */
  static async getUserOAuthConnections(
    userId: number
  ): Promise<IOAuthResponse> {
    try {
      const connections = await OAuthSchemaRepo.getUserOAuthConnections(userId);

      return {
        success: true,
        data: connections,
        message: OAUTH_SUCCESS_MESSAGES.OAUTH_CONNECTIONS_RETRIEVED,
      };
    } catch (error) {
      console.error('Get OAuth Connections Error:', error);
      throw new ApiError(
        OAuthAction.OAUTH_CALLBACK,
        StatusCodes.INTERNAL_SERVER_ERROR,
        OAuthErrorCode.OAUTH_ERROR,
        'Failed to retrieve OAuth connections'
      );
    }
  }

  /**
   * Check OAuth connection status for a provider
   */
  static async checkOAuthConnectionStatus(
    userId: number,
    provider: string
  ): Promise<IOAuthResponse> {
    try {
      const hasConnection = await OAuthSchemaRepo.hasOAuthConnection(
        userId,
        provider
      );

      return {
        success: true,
        data: {
          provider,
          connected: hasConnection,
        },
        message: OAUTH_SUCCESS_MESSAGES.OAUTH_CONNECTION_STATUS_RETRIEVED,
      };
    } catch (error) {
      console.error('Check OAuth Connection Error:', error);
      throw new ApiError(
        OAuthAction.OAUTH_CALLBACK,
        StatusCodes.INTERNAL_SERVER_ERROR,
        OAuthErrorCode.OAUTH_ERROR,
        'Failed to check OAuth connection status'
      );
    }
  }
}
