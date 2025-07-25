import { db } from 'db/mysql.db';
import { users } from '@schema-models';
import { IUserRegistrationInsert } from './registration.types';
import { UserRegistrationSchemaRepo } from './registrationSchema.repository';
import { UserTypeSchemaRepo } from '../userTypes/userTypeSchema.repository';

export class UserRegistrationService {
  static async registerUser(userData: IUserRegistrationInsert) {
    // Insert the user
    const insertRecord = await db.insert(users).values(userData);
    const resultId = insertRecord[0].insertId;
    const insertedRecord =
      await UserRegistrationSchemaRepo.getUserById(resultId);
    if (!insertedRecord) {
      throw new Error('User not found after registration');
    }
    const userType = await UserTypeSchemaRepo.getById(insertedRecord.userType!);
    // Build the response object to match UserRegistrationResponseSchema
    return {
      userId: insertedRecord.userId,
      userName: insertedRecord.userName,
      profilePicture: insertedRecord.profilePicture,
      phoneNumber: insertedRecord.phoneNumber,
      email: insertedRecord.email,
      firstName: insertedRecord.firstName,
      lastName: insertedRecord.lastName,
      password: insertedRecord.password,
      userType: userType ? userType[0] : null,
      is_active: insertedRecord.is_active,
      createdAt: insertedRecord.createdAt,
      updatedAt: insertedRecord.updatedAt,
    };
  }
}
