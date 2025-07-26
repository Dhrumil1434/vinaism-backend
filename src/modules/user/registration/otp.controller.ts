import { asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import { OTPService } from './otp.service';
import { z } from 'zod';

const verifyOTPSchema = z.object({
  userId: z.number(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const resendOTPSchema = z.object({
  userId: z.number(),
});

export class OTPController {
  static verifyOTP = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId, otp } = verifyOTPSchema.parse(req.body);

      const result = await OTPService.verifyOTP(userId, otp);

      res.status(200).json({
        message: 'OTP verified successfully',
        data: {
          userId,
          email_verified: result.email_verified,
          phone_verified: result.phone_verified,
          next_step: 'admin_approval',
        },
      });
    }
  );

  static resendOTP = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId } = resendOTPSchema.parse(req.body);

      await OTPService.resendOTP(userId);

      res.status(200).json({
        message: 'OTP resent successfully',
        data: {
          userId,
          message: 'Check your email and phone for the new OTP',
        },
      });
    }
  );
}
