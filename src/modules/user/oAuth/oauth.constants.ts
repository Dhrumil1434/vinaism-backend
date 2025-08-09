export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
} as const;

export const OAUTH_SCOPES = {
  GOOGLE: 'email profile',
  APPLE: 'email name',
  FACEBOOK: 'email public_profile',
} as const;

export const OAuthZodMessage = {
  PROVIDER_REQUIRED: 'Provider is required',
  PROVIDER_USER_ID_REQUIRED: 'Provider user ID is required',
  EMAIL_INVALID: 'Invalid email format',
  USER_ID_REQUIRED: 'User ID is required',
  INVALID_USER_TYPE_ID: 'Invalid userTypeId. Must be a valid number.',
  USER_TYPE_NOT_FOUND: 'User type does not exist',
  INVALID_USER_TYPE_FORMAT: 'Invalid userTypeId format. Must be a number.',
  USER_TYPE_REQUIRED: 'userTypeId is required when provided',
} as const;

export const OAUTH_ERROR_MESSAGES = {
  INVALID_PROVIDER: 'Invalid OAuth provider',
  AUTHENTICATION_FAILED: 'OAuth authentication failed',
  USER_NOT_FOUND: 'User not found during OAuth authentication',
  TOKEN_EXCHANGE_FAILED: 'Failed to exchange OAuth code for token',
  USER_INFO_FETCH_FAILED:
    'Failed to fetch user information from OAuth provider',
  ACCOUNT_LINKING_FAILED: 'Failed to link OAuth account to existing user',
  DUPLICATE_OAUTH_ACCOUNT: 'OAuth account already exists for this provider',
  OAUTH_ACCOUNT_IN_USE: 'This OAuth account is already linked to another user',
  OAUTH_ALREADY_LINKED: 'Account is already linked with this provider',
  OAUTH_NOT_LINKED: 'Account is not linked with this provider',
  OAUTH_CREATION_FAILED: 'Failed to create user from OAuth profile',
  OAUTH_LINKING_FAILED: 'Failed to link OAuth account',
  OAUTH_UNLINKING_FAILED: 'Failed to unlink OAuth account',
  DEFAULT_USER_TYPE_NOT_FOUND: 'Default user type not configured',
  OAUTH_ERROR: 'Failed to process OAuth login',
  OAUTH_USER_NOT_FOUND: 'User associated with OAuth account not found',
} as const;

export const OAUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'OAuth login successful',
  ACCOUNT_LINKED: 'OAuth account linked successfully',
  USER_CREATED: 'User created successfully via OAuth',
  OAUTH_ACCOUNT_UNLINKED: 'OAuth account unlinked successfully',
  OAUTH_CONNECTIONS_RETRIEVED: 'OAuth connections retrieved successfully',
  OAUTH_CONNECTION_STATUS_RETRIEVED: 'Connection status retrieved successfully',
} as const;

export const OAuthAction = {
  OAUTH_LOGIN: 'OAUTH_LOGIN',
  OAUTH_REGISTRATION: 'OAUTH_REGISTRATION',
  OAUTH_LINK: 'OAUTH_LINK',
  OAUTH_UNLINK: 'OAUTH_UNLINK',
  OAUTH_CALLBACK: 'OAUTH_CALLBACK',
} as const;

export const OAuthErrorCode = {
  OAUTH_AUTHENTICATION_FAILED: 'OAUTH_AUTHENTICATION_FAILED',
  OAUTH_PROVIDER_ERROR: 'OAUTH_PROVIDER_ERROR',
  OAUTH_ACCOUNT_IN_USE: 'OAUTH_ACCOUNT_IN_USE',
  OAUTH_ALREADY_LINKED: 'OAUTH_ALREADY_LINKED',
  OAUTH_NOT_LINKED: 'OAUTH_NOT_LINKED',
  OAUTH_USER_NOT_FOUND: 'OAUTH_USER_NOT_FOUND',
  OAUTH_CREATION_FAILED: 'OAUTH_CREATION_FAILED',
  OAUTH_LINKING_FAILED: 'OAUTH_LINKING_FAILED',
  OAUTH_UNLINKING_FAILED: 'OAUTH_UNLINKING_FAILED',
  DEFAULT_USER_TYPE_NOT_FOUND: 'DEFAULT_USER_TYPE_NOT_FOUND',
  OAUTH_ERROR: 'OAUTH_ERROR',
} as const;

export const OAuthMessage = {
  OAUTH_AUTHENTICATION_FAILED: OAUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED,
  OAUTH_PROVIDER_ERROR: OAUTH_ERROR_MESSAGES.INVALID_PROVIDER,
  OAUTH_ACCOUNT_IN_USE: OAUTH_ERROR_MESSAGES.OAUTH_ACCOUNT_IN_USE,
  OAUTH_ALREADY_LINKED: OAUTH_ERROR_MESSAGES.OAUTH_ALREADY_LINKED,
  OAUTH_NOT_LINKED: OAUTH_ERROR_MESSAGES.OAUTH_NOT_LINKED,
  OAUTH_USER_NOT_FOUND: OAUTH_ERROR_MESSAGES.OAUTH_USER_NOT_FOUND,
  OAUTH_CREATION_FAILED: OAUTH_ERROR_MESSAGES.OAUTH_CREATION_FAILED,
  OAUTH_LINKING_FAILED: OAUTH_ERROR_MESSAGES.OAUTH_LINKING_FAILED,
  OAUTH_UNLINKING_FAILED: OAUTH_ERROR_MESSAGES.OAUTH_UNLINKING_FAILED,
  DEFAULT_USER_TYPE_NOT_FOUND: OAUTH_ERROR_MESSAGES.DEFAULT_USER_TYPE_NOT_FOUND,
  OAUTH_ERROR: OAUTH_ERROR_MESSAGES.OAUTH_ERROR,
  OAUTH_LOGIN_SUCCESSFUL: OAUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
  OAUTH_ACCOUNT_LINKED: OAUTH_SUCCESS_MESSAGES.ACCOUNT_LINKED,
  OAUTH_ACCOUNT_UNLINKED: OAUTH_SUCCESS_MESSAGES.OAUTH_ACCOUNT_UNLINKED,
  OAUTH_CONNECTIONS_RETRIEVED:
    OAUTH_SUCCESS_MESSAGES.OAUTH_CONNECTIONS_RETRIEVED,
  OAUTH_CONNECTION_STATUS_RETRIEVED:
    OAUTH_SUCCESS_MESSAGES.OAUTH_CONNECTION_STATUS_RETRIEVED,
} as const;

export const OAuthConfig = {
  // Token expiry times
  REFRESH_TOKEN_EXPIRY_DAYS: 30,
  ACCESS_TOKEN_EXPIRY_SECONDS: 3600, // 1 hour

  // Default user type for OAuth users
  DEFAULT_USER_TYPE_ID: 32, // Updated to match your actual database

  // OAuth scopes
  GOOGLE_SCOPES: ['profile', 'email'],
  FACEBOOK_SCOPES: ['email', 'public_profile'],
  APPLE_SCOPES: ['name', 'email'],

  // OAuth access types
  GOOGLE_ACCESS_TYPE: 'offline',
  GOOGLE_PROMPT: 'consent',
} as const;
