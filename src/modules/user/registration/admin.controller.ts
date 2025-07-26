import { asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import { UserRegistrationSchemaRepo } from './registrationSchema.repository';
import { z } from 'zod';
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';

const approveUserSchema = z.object({
  userId: z.number(),
});

const rejectUserSchema = z.object({
  userId: z.number(),
  reason: z.string().optional(),
});

export class AdminController {
  static getPendingApprovals = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const pendingUsers =
        await UserRegistrationSchemaRepo.getPendingAdminApprovalUsers();

      res.status(200).json({
        message: 'Pending approvals retrieved successfully',
        data: pendingUsers,
      });
    }
  );

  static approveUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId } = approveUserSchema.parse(req.body);

      // Check if user exists and is verified
      const user = await UserRegistrationSchemaRepo.getUserById(userId);
      if (!user) {
        throw new ApiError(
          'APPROVE_USER',
          StatusCodes.NOT_FOUND,
          'USER_NOT_FOUND',
          'User not found',
          [{ field: 'userId', message: 'User not found' }]
        );
      }

      if (!user.email_verified || !user.phone_verified) {
        throw new ApiError(
          'APPROVE_USER',
          StatusCodes.BAD_REQUEST,
          'USER_NOT_VERIFIED',
          'User must be verified before approval',
          [{ field: 'userId', message: 'User must be verified' }]
        );
      }

      if (user.admin_approved) {
        throw new ApiError(
          'APPROVE_USER',
          StatusCodes.BAD_REQUEST,
          'USER_ALREADY_APPROVED',
          'User is already approved',
          [{ field: 'userId', message: 'User already approved' }]
        );
      }

      await UserRegistrationSchemaRepo.approveUserByAdmin(userId);

      res.status(200).json({
        message: 'User approved successfully',
        data: {
          userId,
          status: 'approved',
          is_active: true,
        },
      });
    }
  );

  static rejectUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId, reason } = rejectUserSchema.parse(req.body);

      // Check if user exists
      const user = await UserRegistrationSchemaRepo.getUserById(userId);
      if (!user) {
        throw new ApiError(
          'REJECT_USER',
          StatusCodes.NOT_FOUND,
          'USER_NOT_FOUND',
          'User not found',
          [{ field: 'userId', message: 'User not found' }]
        );
      }

      // TODO: Implement rejection logic (maybe mark as rejected or delete)
      // For now, we'll just return a success message

      res.status(200).json({
        message: 'User rejected successfully',
        data: {
          userId,
          status: 'rejected',
          reason: reason || 'No reason provided',
        },
      });
    }
  );
}
