import { users } from '@schema-models';
import { eq } from 'drizzle-orm';
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
}
