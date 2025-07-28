import { db } from '../../../../db/mysql.db';
import { loginSessions } from '@schema-models';
import { eq, and, lt } from 'drizzle-orm';
import {
  LoginSessionCreate,
  LoginSessionUpdate,
} from '../validators/loginSession.validator';

export class LoginSessionRepo {
  /**
   * Create a new login session
   */
  static async create(data: LoginSessionCreate) {
    const result = await db.insert(loginSessions).values({
      userId: data.userId,
      refreshToken: data.refreshToken,
      expiresAt: new Date(data.expiresAt), // Convert string to Date for database
      userAgent: data.userAgent || null,
      ipAddress: data.ipAddress || null,
    });

    const sessionId = result[0].insertId;
    return await this.getById(sessionId);
  }

  /**
   * Get session by ID
   */
  static async getById(sessionId: number) {
    return await db
      .select()
      .from(loginSessions)
      .where(eq(loginSessions.sessionId, sessionId))
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  /**
   * Get active session by refresh token
   */
  static async getByRefreshToken(refreshToken: string) {
    return await db
      .select()
      .from(loginSessions)
      .where(
        and(
          eq(loginSessions.refreshToken, refreshToken),
          eq(loginSessions.isActive, true)
        )
      )
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  /**
   * Get all active sessions for a user
   */
  static async getActiveSessionsByUserId(userId: number) {
    return await db
      .select()
      .from(loginSessions)
      .where(
        and(eq(loginSessions.userId, userId), eq(loginSessions.isActive, true))
      );
  }

  /**
   * Update session
   */
  static async update(sessionId: number, data: LoginSessionUpdate) {
    const updateData: any = { ...data };

    // Convert expiresAt string to Date if provided
    if (data.expiresAt) {
      updateData.expiresAt = new Date(data.expiresAt);
    }

    await db
      .update(loginSessions)
      .set(updateData)
      .where(eq(loginSessions.sessionId, sessionId));

    return await this.getById(sessionId);
  }

  /**
   * Deactivate session (soft delete)
   */
  static async deactivate(sessionId: number) {
    return await this.update(sessionId, { isActive: false });
  }

  /**
   * Deactivate all sessions for a user
   */
  static async deactivateAllForUser(userId: number) {
    await db
      .update(loginSessions)
      .set({ isActive: false })
      .where(eq(loginSessions.userId, userId));
  }

  /**
   * Delete expired sessions
   */
  static async deleteExpired() {
    const now = new Date();
    await db.delete(loginSessions).where(lt(loginSessions.expiresAt, now));
  }

  /**
   * Validate refresh token
   */
  static async validateRefreshToken(refreshToken: string): Promise<boolean> {
    const session = await this.getByRefreshToken(refreshToken);
    if (!session) return false;

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now > expiresAt) {
      // Session expired, deactivate it
      await this.deactivate(session.sessionId);
      return false;
    }

    return true;
  }
}
