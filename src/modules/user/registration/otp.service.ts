import { UserRegistrationSchemaRepo } from './registrationSchema.repository';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';

export class OTPService {
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static getOTPExpiryTime(): Date {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // OTP expires in 10 minutes
    return expiryTime;
  }

  static async sendOTPToEmail(email: string, otp: string): Promise<void> {
    // TODO: Implement email service (Nodemailer, SendGrid, etc.)
    console.log(`OTP ${otp} sent to email: ${email}`);
  }

  static async sendOTPToPhone(phoneNumber: string, otp: string): Promise<void> {
    // TODO: Implement SMS service (Twilio, AWS SNS, etc.)
    console.log(`OTP ${otp} sent to phone: ${phoneNumber}`);
  }

  static async generateAndSendOTP(
    userId: number,
    email: string,
    phoneNumber: string
  ): Promise<void> {
    const otp = this.generateOTP();
    const otpExpiry = this.getOTPExpiryTime();

    // Update user with OTP
    await UserRegistrationSchemaRepo.updateUserOTP(userId, otp, otpExpiry);

    // Send OTP to both email and phone
    await Promise.all([
      this.sendOTPToEmail(email, otp),
      this.sendOTPToPhone(phoneNumber, otp),
    ]);
  }

  static async verifyOTP(
    userId: number,
    otp: string
  ): Promise<{ email_verified: boolean; phone_verified: boolean }> {
    const user = await UserRegistrationSchemaRepo.getUserById(userId);

    if (!user) {
      throw new ApiError(
        'VERIFY_OTP',
        StatusCodes.NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        [{ field: 'userId', message: 'User not found' }]
      );
    }

    if (!user.otp_code || !user.otp_expires_at) {
      throw new ApiError(
        'VERIFY_OTP',
        StatusCodes.BAD_REQUEST,
        'NO_OTP_FOUND',
        'No OTP found for this user',
        [{ field: 'otp', message: 'No OTP found' }]
      );
    }

    if (new Date() > user.otp_expires_at) {
      throw new ApiError(
        'VERIFY_OTP',
        StatusCodes.BAD_REQUEST,
        'OTP_EXPIRED',
        'OTP has expired',
        [{ field: 'otp', message: 'OTP has expired' }]
      );
    }

    if (user.otp_code !== otp) {
      throw new ApiError(
        'VERIFY_OTP',
        StatusCodes.BAD_REQUEST,
        'INVALID_OTP',
        'Invalid OTP',
        [{ field: 'otp', message: 'Invalid OTP' }]
      );
    }

    // Mark both email and phone as verified
    await UserRegistrationSchemaRepo.markUserVerified(userId, true, true);

    return { email_verified: true, phone_verified: true };
  }

  static async resendOTP(userId: number): Promise<void> {
    const user = await UserRegistrationSchemaRepo.getUserById(userId);

    if (!user) {
      throw new ApiError(
        'RESEND_OTP',
        StatusCodes.NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        [{ field: 'userId', message: 'User not found' }]
      );
    }

    await this.generateAndSendOTP(userId, user.email, user.phoneNumber);
  }
}
