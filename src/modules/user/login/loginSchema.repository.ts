import { users } from '@schema-models';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/mysql.db';
import { UserRegistrationSchemaRepo } from '../registration/registrationSchema.repository';
import { LoginSessionRepo } from './repositories/loginSession.repository';
import { LoginAttemptsRepo } from './repositories/loginAttempts.repository';

export class LoginSchemaRepo {
  /**
   * Get user by email or phone number
   */
  static async getUserByEmailOrPhone(email?: string, phoneNumber?: string) {
    if (email && phoneNumber) {
      // If both provided, check if they match the same user
      const userByEmail =
        await UserRegistrationSchemaRepo.getUserByEmail(email);
      const userByPhone =
        await UserRegistrationSchemaRepo.getUserByPhoneNumber(phoneNumber);

      if (
        userByEmail &&
        userByPhone &&
        userByEmail.userId === userByPhone.userId
      ) {
        return userByEmail;
      }
      return null;
    } else if (email) {
      return await UserRegistrationSchemaRepo.getUserByEmail(email);
    } else if (phoneNumber) {
      return await UserRegistrationSchemaRepo.getUserByPhoneNumber(phoneNumber);
    }
    return null;
  }

  /**
   * Get user by ID using registration repository
   */
  static async getUserById(userId: number) {
    return await UserRegistrationSchemaRepo.getUserById(userId);
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(userId: number) {
    return await db
      .update(users)
      .set({
        updatedAt: new Date().toISOString(), // This is correct for mode: 'string'
      })
      .where(eq(users.userId, userId));
  }

  /**
   * Store refresh token using dedicated login sessions table
   */
  static async storeRefreshToken(
    userId: number,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return await LoginSessionRepo.create({
      userId,
      refreshToken,
      expiresAt: expiresAt.toISOString(), // Pass Date object, not string
      userAgent,
      ipAddress,
    });
  }

  /**
   * Validate refresh token using dedicated login sessions table
   */
  static async validateRefreshToken(userId: number, refreshToken: string) {
    const session = await LoginSessionRepo.getByRefreshToken(refreshToken);
    return session && session.userId === userId && session.isActive;
  }

  /**
   * Remove refresh token using dedicated login sessions table
   */
  static async removeRefreshToken(userId: number, refreshToken?: string) {
    if (refreshToken) {
      // Remove specific session
      const session = await LoginSessionRepo.getByRefreshToken(refreshToken);
      if (session && session.userId === userId) {
        await LoginSessionRepo.deactivate(session.sessionId);
      }
    } else {
      // Remove all sessions for user
      await LoginSessionRepo.deactivateAllForUser(userId);
    }
  }

  /**
   * Get all active sessions for a user
   */
  static async getActiveSessionsByUserId(userId: number) {
    return await LoginSessionRepo.getActiveSessionsByUserId(userId);
  }

  /**
   * Increment login attempts using dedicated login attempts table
   */
  static async incrementLoginAttempts(
    userId: number,
    _ipAddress?: string,
    _userAgent?: string
  ) {
    return await LoginAttemptsRepo.incrementAttempts(userId);
  }

  /**
   * Reset login attempts using dedicated login attempts table
   */
  static async resetLoginAttempts(userId: number) {
    return await LoginAttemptsRepo.resetAttempts(userId);
  }

  /**
   * Lock account using dedicated login attempts table
   */
  static async lockAccount(
    userId: number,
    lockoutUntil: Date,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await LoginAttemptsRepo.lockAccount(
      userId,
      lockoutUntil,
      ipAddress,
      userAgent
    );
  }

  /**
   * Unlock account using dedicated login attempts table
   */
  static async unlockAccount(userId: number) {
    return await LoginAttemptsRepo.unlockAccount(userId);
  }

  /**
   * Check if account is locked using dedicated login attempts table
   */
  static async isAccountLocked(userId: number): Promise<boolean> {
    return await LoginAttemptsRepo.isAccountLocked(userId);
  }

  /**
   * Check if account is locked and unlock if expired
   */
  static async isAccountLockedAndUnlockIfExpired(
    userId: number
  ): Promise<boolean> {
    return await LoginAttemptsRepo.isAccountLockedAndUnlockIfExpired(userId);
  }

  /**
   * Get current attempt count using dedicated login attempts table
   */
  static async getAttemptCount(userId: number): Promise<number> {
    return await LoginAttemptsRepo.getAttemptCount(userId);
  }

  /**
   * Get login attempts record for user
   */
  static async getLoginAttemptsByUserId(userId: number) {
    return await LoginAttemptsRepo.getByUserId(userId);
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    return await LoginSessionRepo.deleteExpired();
  }
}
