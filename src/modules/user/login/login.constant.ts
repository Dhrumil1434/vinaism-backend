export enum UserLoginZodMessage {
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Invalid email format',
  PHONE_REQUIRED = 'Phone number is required',
  PHONE_INVALID = 'Phone number must contain only digits and be between 10-15 characters',
  PASSWORD_REQUIRED = 'Password is required',
  PASSWORD_EMPTY = 'Password cannot be empty',
  EITHER_EMAIL_OR_PHONE = 'Either email or phone number is required',
  NOT_BOTH_EMAIL_PHONE = 'Please provide either email or phone number, not both',
}

export enum UserLoginAction {
  LOGIN_USER = 'LOGIN_USER',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  LOGOUT_USER = 'LOGOUT_USER',
}

export enum UserLoginErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',
  ACCOUNT_NOT_APPROVED = 'ACCOUNT_NOT_APPROVED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_MISSING = 'TOKEN_MISSING',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
}

export enum UserLoginMessage {
  LOGIN_SUCCESS = 'Login successful',
  LOGIN_FAILED = 'Invalid credentials',
  ACCOUNT_NOT_VERIFIED = 'Please verify your email first',
  ACCOUNT_NOT_APPROVED = 'Account is not approved by admin',
  ACCOUNT_INACTIVE = 'Account is inactive',
  TOKEN_REFRESHED = 'Token refreshed successfully',
  LOGOUT_SUCCESS = 'Logout successful',
  TOO_MANY_ATTEMPTS = 'Too many login attempts. Try again later',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  INVALID_ACCESS_TOKEN = 'Invalid access token',
  REFRESH_TOKEN_EXPIRED = 'Refresh token expired',
  USER_NOT_FOUND = 'User not found',
  REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found',
}

export enum UserLoginConfig {
  ACCESS_TOKEN_EXPIRY = '15m',
  REFRESH_TOKEN_EXPIRY = '7d',
  MAX_LOGIN_ATTEMPTS = 10,
  ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60, // 15 minutes in seconds
  REFRESH_TOKEN_EXPIRY_DAYS = 7,
  REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}

// Cookie configuration constants
export const COOKIE_CONFIG = {
  REFRESH_TOKEN_NAME: 'refreshToken',
  REFRESH_TOKEN_PATH: '/', // Changed from '/api/userLogin' to '/' for broader access
  REFRESH_TOKEN_HTTP_ONLY: true,
  REFRESH_TOKEN_SECURE: process.env['NODE_ENV'] === 'production',
  REFRESH_TOKEN_SAME_SITE: 'strict' as const,

  // Access token cookie configuration
  ACCESS_TOKEN_NAME: 'accessToken',
  ACCESS_TOKEN_PATH: '/',
  ACCESS_TOKEN_HTTP_ONLY: false, // Allow JavaScript access for API calls
  ACCESS_TOKEN_SECURE: process.env['NODE_ENV'] === 'production',
  ACCESS_TOKEN_SAME_SITE: 'strict' as const,
} as const;
