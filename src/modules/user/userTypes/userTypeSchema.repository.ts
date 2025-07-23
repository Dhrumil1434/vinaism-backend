import { db } from '../../../db/mysql.db';
import { eq } from 'drizzle-orm';
import { userTypes } from '../../../schema/userTypes.schema';

export class UserTypeSchemaRepo {
  static async getAll() {
    return db.select().from(userTypes);
  }
  static async getAllActive() {
    return db.select().from(userTypes).where(eq(userTypes.is_active, true));
  }
  static async getById(userTypeId: number) {
    return db
      .select()
      .from(userTypes)
      .where(eq(userTypes.userTypeId, userTypeId));
  }
}
