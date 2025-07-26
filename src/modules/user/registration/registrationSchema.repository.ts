import { users } from '@schema-models';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../db/mysql.db';
import { UserTypeSchemaRepo } from '../userTypes/userTypeSchema.repository';

export class UserRegistrationSchemaRepo {
  static async getAllRegisteredUsers() {
    return await db.select().from(users);
  }
  static async getAllActivelyRegisteredUsers() {
    return await db.select().from(users).where(eq(users.is_active, true));
  }
  static async getActivatedUserTypeById(userTypeId: number): Promise<boolean> {
    const [userType] = await UserTypeSchemaRepo.getById(userTypeId);
    return !!(userType && userType.is_active);
  }
  static async getUserByEmail(email: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0] || null);
  }
  static async getUserByFirstName(firstName: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.firstName, firstName))
      .then((rows) => rows[0] || null);
  }
  static async getUserByPhoneNumber(phoneNumber: string) {
    return await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .then((rows) => rows[0] || null);
  }
  static async getUserById(userId: number) {
    return await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .then((rows) => rows[0] || null);
  }

  // New methods for OTP and verification
  static async updateUserOTP(userId: number, otp: string, otpExpiresAt: Date) {
    return await db
      .update(users)
      .set({
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      })
      .where(eq(users.userId, userId));
  }

  static async markUserVerified(
    userId: number,
    emailVerified: boolean,
    phoneVerified: boolean
  ) {
    return await db
      .update(users)
      .set({
        email_verified: emailVerified,
        phone_verified: phoneVerified,
        otp_code: null,
        otp_expires_at: null,
      })
      .where(eq(users.userId, userId));
  }

  static async approveUserByAdmin(userId: number) {
    return await db
      .update(users)
      .set({
        admin_approved: true,
        is_active: true,
      })
      .where(eq(users.userId, userId));
  }

  static async getPendingAdminApprovalUsers() {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email_verified, true),
          eq(users.phone_verified, true),
          eq(users.admin_approved, false)
        )
      );
  }

  static async getVerifiedUsers() {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email_verified, true),
          eq(users.phone_verified, true),
          eq(users.admin_approved, true),
          eq(users.is_active, true)
        )
      );
  }
}
