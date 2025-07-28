import { db } from '../../../../db/mysql.db';
import { loginAttempts } from '@schema-models';
import { eq } from 'drizzle-orm';
import {
  LoginAttemptsCreate,
  LoginAttemptsUpdate,
} from '../validators/loginAttempts.validator';

export class LoginAttemptsRepo {
  /**
   * Create a new login attempts record
   */
  static async create(data: LoginAttemptsCreate) {
    const result = await db.insert(loginAttempts).values({
      userId: data.userId,
      attemptCount: 0,
      isLocked: false,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    });

    const attemptId = result[0].insertId;
    return await this.getById(attemptId);
  }

  /**
   * Get attempts record by ID
   */
  static async getById(attemptId: number) {
    return await db
      .select()
      .from(loginAttempts)
      .where(eq(loginAttempts.attemptId, attemptId))
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  /**
   * Get attempts record by user ID
   */
  static async getByUserId(userId: number) {
    return await db
      .select()
      .from(loginAttempts)
      .where(eq(loginAttempts.userId, userId))
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  /**
   * Get or create attempts record for user
   */
  static async getOrCreate(
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ) {
    let record = await this.getByUserId(userId);

    if (!record) {
      record = await this.create({
        userId,
        ipAddress,
        userAgent,
      });
    }

    return record;
  }

  /**
   * Update attempts record
   */
  static async update(attemptId: number, data: LoginAttemptsUpdate) {
    await db
      .update(loginAttempts)
      .set(data)
      .where(eq(loginAttempts.attemptId, attemptId));

    return await this.getById(attemptId);
  }

  /**
   * Increment login attempts
   */
  static async incrementAttempts(
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ) {
    const record = await this.getOrCreate(userId, ipAddress, userAgent);
    if (!record) return null;

    const newAttemptCount = (record.attemptCount || 0) + 1;
    const now = new Date().toISOString(); // String for mode: 'string' fields

    return await this.update(record.attemptId, {
      attemptCount: newAttemptCount,
      lastAttemptAt: now,
      ipAddress: ipAddress || record.ipAddress,
      userAgent: userAgent || record.userAgent,
    });
  }

  /**
   * Reset login attempts
   */
  static async resetAttempts(userId: number) {
    const record = await this.getByUserId(userId);
    if (!record) return null;

    return await this.update(record.attemptId, {
      attemptCount: 0,
      isLocked: false,
      lockoutUntil: null,
    });
  }

  /**
   * Lock account
   */
  static async lockAccount(
    userId: number,
    lockoutUntil: Date,
    ipAddress?: string,
    userAgent?: string
  ) {
    const record = await this.getOrCreate(userId, ipAddress, userAgent);
    if (!record) return null;

    const newAttemptCount = (record.attemptCount || 0) + 1;
    const now = new Date().toISOString(); // String for mode: 'string' fields

    return await this.update(record.attemptId, {
      attemptCount: newAttemptCount,
      isLocked: true,
      lockoutUntil: lockoutUntil.toISOString(), // String for mode: 'string' field
      lastAttemptAt: now,
      ipAddress: ipAddress || record.ipAddress,
      userAgent: userAgent || record.userAgent,
    });
  }

  /**
   * Unlock account
   */
  static async unlockAccount(userId: number) {
    const record = await this.getByUserId(userId);
    if (!record) return null;

    return await this.update(record.attemptId, {
      attemptCount: 0,
      isLocked: false,
      lockoutUntil: null,
    });
  }

  /**
   * Check if account is locked
   */
  static async isAccountLocked(userId: number): Promise<boolean> {
    const record = await this.getByUserId(userId);
    if (!record) return false;

    // If not locked or no lockout time, definitely not locked
    if (!record.isLocked || !record.lockoutUntil) {
      return false;
    }

    const now = new Date();
    const lockoutUntil = new Date(record.lockoutUntil);

    // If lockout period has expired, account is not locked
    if (now > lockoutUntil) {
      return false;
    }

    // Account is locked and lockout period is still active
    return true;
  }

  /**
   * Check if account is locked and unlock if expired
   */
  static async isAccountLockedAndUnlockIfExpired(
    userId: number
  ): Promise<boolean> {
    const record = await this.getByUserId(userId);
    if (!record) return false;

    if (!record.isLocked || !record.lockoutUntil) {
      return false;
    }

    const now = new Date();
    const lockoutUntil = new Date(record.lockoutUntil);

    if (now > lockoutUntil) {
      // Lockout period expired, unlock the account
      await this.unlockAccount(userId);
      return false;
    }

    return true;
  }

  /**
   * Get current attempt count
   */
  static async getAttemptCount(userId: number): Promise<number> {
    const record = await this.getByUserId(userId);
    return record ? record.attemptCount || 0 : 0;
  }
}
