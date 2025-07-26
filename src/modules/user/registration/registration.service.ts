import { db } from '../../../db/mysql.db';
import { users } from '@schema-models';
import {
  IUserRegistrationInsert,
  UserRegistrationFilters,
} from './registration.types';
import { UserRegistrationSchemaRepo } from './registrationSchema.repository';
import { UserTypeSchemaRepo } from '../userTypes/userTypeSchema.repository';
import { OTPService } from './otp.service';
import {
  getPaginatedUsers,
  getAllUsers,
  getUsersByStatus,
  getUserById,
  getPendingAdminApproval,
  getVerifiedUsers,
} from './utils/getUser.util';

export class UserRegistrationService {
  static async registerUser(userData: IUserRegistrationInsert) {
    // Ensure user is registered as inactive by default
    const userDataWithDefaults = {
      ...userData,
      is_active: false,
      email_verified: false,
      phone_verified: false,
      admin_approved: false,
    };

    // Insert the user
    const insertRecord = await db.insert(users).values(userDataWithDefaults);
    const resultId = insertRecord[0].insertId;
    const insertedRecord =
      await UserRegistrationSchemaRepo.getUserById(resultId);
    if (!insertedRecord) {
      throw new Error('User not found after registration');
    }

    // Generate and send OTP
    await OTPService.generateAndSendOTP(
      resultId,
      insertedRecord.email,
      insertedRecord.phoneNumber
    );

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
      email_verified: insertedRecord.email_verified,
      phone_verified: insertedRecord.phone_verified,
      admin_approved: insertedRecord.admin_approved,
      createdAt: insertedRecord.createdAt,
      updatedAt: insertedRecord.updatedAt,
    };
  }

  // Get paginated users with filters
  static async getPaginatedUsers(
    page = 1,
    limit = 10,
    filters: UserRegistrationFilters = {}
  ) {
    return getPaginatedUsers(page, limit, filters);
  }

  // Get all users (active and inactive)
  static async getAllUsers() {
    return getAllUsers();
  }

  // Get users by status
  static async getUsersByStatus(status: string, page = 1, limit = 10) {
    return getUsersByStatus(status, page, limit);
  }

  // Get user by ID
  static async getUserById(userId: number) {
    return getUserById(userId);
  }

  // Get pending admin approval users
  static async getPendingAdminApproval(page = 1, limit = 10) {
    return getPendingAdminApproval(page, limit);
  }

  // Get verified users (email and phone verified)
  static async getVerifiedUsers(page = 1, limit = 10) {
    return getVerifiedUsers(page, limit);
  }
}
