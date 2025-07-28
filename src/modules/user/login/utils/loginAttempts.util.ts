import { LoginAttemptsRepo } from '../repositories/loginAttempts.repository';
import { UserRegistrationSchemaRepo } from '../../registration/registrationSchema.repository';

/**
 * Utility to create initial login attempt record for a user
 * Useful for testing or when you want to pre-populate the table
 */
export class LoginAttemptsUtil {
  /**
   * Create initial login attempt record for a user
   */
  static async createInitialRecord(
    email: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      // Get user by email
      const user = await UserRegistrationSchemaRepo.getUserByEmail(email);
      if (!user) {
        throw new Error(`User not found with email: ${email}`);
      }

      // Check if record already exists
      const existingRecord = await LoginAttemptsRepo.getByUserId(user.userId);
      if (existingRecord) {
        console.log(
          `Login attempt record already exists for user ${user.userId}`
        );
        return existingRecord;
      }

      // Create new record
      const newRecord = await LoginAttemptsRepo.create({
        userId: user.userId,
        ipAddress: ipAddress || '127.0.0.1',
        userAgent: userAgent || 'Manual Creation',
      });

      return newRecord;
    } catch (error) {
      if (error instanceof Error) {
      } else {
        console.error(
          '❌ Error creating initial login attempt record:',
          String(error)
        );
      }
      throw error;
    }
  }

  /**
   * Create initial records for multiple users
   */
  static async createInitialRecordsForUsers(
    emails: string[],
    ipAddress?: string,
    userAgent?: string
  ) {
    const results = [];

    for (const email of emails) {
      try {
        const record = await this.createInitialRecord(
          email,
          ipAddress,
          userAgent
        );
        results.push({ email, success: true, record });
      } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = String(error);
        }
        results.push({ email, success: false, error: errorMessage });
      }
    }

    return results;
  }

  /**
   * Get login attempt statistics
   */
  static async getLoginAttemptStats() {
    try {
      // This would require a direct database query or additional repository method
      // For now, we'll return basic info
      return {
        message: 'Login attempt statistics would be available here',
        note: 'Add repository method to get aggregate statistics',
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error getting login attempt stats:', error.message);
      } else {
        console.error('❌ Error getting login attempt stats:', String(error));
      }
      throw error;
    }
  }
}
