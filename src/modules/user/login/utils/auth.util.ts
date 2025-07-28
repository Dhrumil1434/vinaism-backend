import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IJWTPayload, IRefreshTokenPayload } from '../login.types';
import { UserTypeSchemaRepo } from '../../userTypes/userTypeSchema.repository';
import { UserLoginConfig } from '../login.constant';

/**
 * Generate access token with user type information
 */
export const generateAccessToken = async (payload: {
  userId: number;
  email: string;
  userTypeId: number;
}): Promise<string> => {
  // Get user type details
  const userTypeResult = await UserTypeSchemaRepo.getById(payload.userTypeId);
  const userType =
    userTypeResult && userTypeResult[0] ? userTypeResult[0] : null;

  const jwtPayload: Omit<IJWTPayload, 'iat' | 'exp'> = {
    userId: payload.userId,
    email: payload.email,
    userType: userType
      ? {
          userTypeId: userType.userTypeId,
          typeName: userType.typeName,
          description: userType.description,
          is_active: userType.is_active,
        }
      : {
          userTypeId: 0,
          typeName: null,
          description: null,
          is_active: null,
        },
  };

  return jwt.sign(jwtPayload, process.env['ACCESS_TOKEN_SECRET']!, {
    expiresIn: UserLoginConfig.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: number): string => {
  const payload: Omit<IRefreshTokenPayload, 'iat' | 'exp'> = {
    userId,
    tokenId: crypto.randomUUID(),
  };

  return jwt.sign(payload, process.env['REFRESH_TOKEN_SECRET']!, {
    expiresIn: UserLoginConfig.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): IJWTPayload => {
  try {
    return jwt.verify(
      token,
      process.env['ACCESS_TOKEN_SECRET']!
    ) as IJWTPayload;
  } catch {
    throw new Error('Invalid access token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
  try {
    return jwt.verify(
      token,
      process.env['REFRESH_TOKEN_SECRET']!
    ) as IRefreshTokenPayload;
  } catch {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Hash refresh token for storage
 */
export const hashRefreshToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 10);
};

/**
 * Compare refresh token with hash
 */
export const compareRefreshToken = async (
  token: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(token, hash);
};

/**
 * Verify password - handles both plain text and hashed passwords
 */
export const verifyPassword = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  // Check if stored password is hashed (bcrypt hashes start with $2b$)
  if (storedPassword.startsWith('$2b$')) {
    // Password is hashed, use bcrypt compare
    return await bcrypt.compare(inputPassword, storedPassword);
  } else {
    // Password is plain text, do direct comparison
    return inputPassword === storedPassword;
  }
};
