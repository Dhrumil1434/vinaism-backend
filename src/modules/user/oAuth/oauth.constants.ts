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

export const OAUTH_ERROR_MESSAGES = {
  INVALID_PROVIDER: 'Invalid OAuth provider',
  AUTHENTICATION_FAILED: 'OAuth authentication failed',
  USER_NOT_FOUND: 'User not found during OAuth authentication',
  TOKEN_EXCHANGE_FAILED: 'Failed to exchange OAuth code for token',
  USER_INFO_FETCH_FAILED:
    'Failed to fetch user information from OAuth provider',
  ACCOUNT_LINKING_FAILED: 'Failed to link OAuth account to existing user',
  DUPLICATE_OAUTH_ACCOUNT: 'OAuth account already exists for this provider',
} as const;

export const OAUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'OAuth login successful',
  ACCOUNT_LINKED: 'OAuth account linked successfully',
  USER_CREATED: 'User created successfully via OAuth',
} as const;
