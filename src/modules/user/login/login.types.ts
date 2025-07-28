import z from 'zod';
import {
  userLoginSchemaDto,
  LoginUserData,
  LoginResponse,
} from './validators/login.dto';

// Export the DTO types directly
export type ILoginCredentials = z.infer<typeof userLoginSchemaDto>;
export type ILoginUser = LoginUserData;
export type ILoginResponse = LoginResponse;

// Since logout now uses cookies, no request body is needed
export type ILogoutRequest = void; // No request body needed for logout

// JWT Payload interfaces
export interface IJWTPayload {
  userId: number;
  email: string;
  userType: {
    userTypeId: number;
    typeName: string | null;
    description: string | null;
    is_active: boolean | null;
  };
  iat: number;
  exp: number;
}

export interface IRefreshTokenPayload {
  userId: number;
  tokenId: string;
  iat: number;
  exp: number;
}

// Additional types for internal use
export interface ILoginAttempts {
  attemptId: number;
  userId: number;
  attemptCount: number;
  isLocked: boolean;
  lockoutUntil: string | null;
  lastAttemptAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginSession {
  sessionId: number;
  userId: number;
  refreshToken: string;
  isActive: boolean;
  expiresAt: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
}
