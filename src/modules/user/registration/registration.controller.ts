import { asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import {
  UserRegistrationInsertSchemaDto,
  UserRegistrationResponseSchema,
  userRegistrationFilterSchema,
  paginatedUserRegistrationResponseSchema,
  userRegistrationRecordArraySchema,
} from './validators/registration.dtos';
import path from 'path';
import { configDotenv } from 'dotenv';
import {
  generateFileName,
  saveBufferedFile,
} from 'utils/saveBufferedFile.util';
import {
  validateUniqueEmail,
  validateUniquePhoneNumber,
  validateUserTypeExists,
} from './validators/registration.validators';
import { UserRegistrationService } from './registration.service';
import { ApiResponse } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { UserRegistrationMessage } from './registration.constants';

configDotenv();

export class UserRegistrationController {
  static registerUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const validateInsert = z.parse(UserRegistrationInsertSchemaDto, req.body);
      const uploadDir = process.env['UPLOAD_DIRECTORY'] || 'public/uploads';

      await validateUserTypeExists(validateInsert.userType);
      await validateUniqueEmail(validateInsert.email);
      await validateUniquePhoneNumber(validateInsert.phoneNumber);

      // Only handle file if present
      let publicPath = '';

      const userDataForService = {
        ...validateInsert,
        profilePicture: publicPath || validateInsert.profilePicture,
      };

      if (req.file && req.file.buffer) {
        const fileName = generateFileName(req.file.originalname);
        const filePath = path.join(uploadDir, fileName);
        await saveBufferedFile(req.file.buffer, filePath);
        publicPath = `/uploads/${fileName}`;
      }

      const registeredUser =
        await UserRegistrationService.registerUser(userDataForService);

      const responseData = UserRegistrationResponseSchema.parse(registeredUser);

      res.status(201).json({
        message: 'User registered successfully',
        data: responseData,
      });
    }
  );

  // Get paginated users with filters
  static getPaginatedUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const { page, limit, ...rest } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const filters = userRegistrationFilterSchema.parse(rest);

      const result = await UserRegistrationService.getPaginatedUsers(
        pageNum,
        limitNum,
        filters
      );

      const validated = paginatedUserRegistrationResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: UserRegistrationMessage.GET_USERS_SUCCESS,
        success: true,
      });

      res.json(validated);
    }
  );

  // Get all users (active and inactive)
  static getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const allUsers = await UserRegistrationService.getAllUsers();
    const validated = userRegistrationRecordArraySchema.parse(allUsers);
    const response = new ApiResponse(
      StatusCodes.OK,
      validated,
      'All users retrieved successfully'
    );
    res.status(response.statusCode).json(response);
  });

  // Get users by status (pending verification, verified, approved, etc.)
  static getUsersByStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { status } = req.params;
      const { page, limit } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;

      const result = await UserRegistrationService.getUsersByStatus(
        status!,
        pageNum,
        limitNum
      );

      const validated = paginatedUserRegistrationResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: `Users with status '${status}' retrieved successfully`,
        success: true,
      });

      res.json(validated);
    }
  );

  // Get user by ID
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await UserRegistrationService.getUserById(Number(userId));

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
        data: null,
      });
      return;
    }

    const validated = UserRegistrationResponseSchema.parse(user);
    const response = new ApiResponse(
      StatusCodes.OK,
      validated,
      'User retrieved successfully'
    );
    res.status(response.statusCode).json(response);
  });

  // Get pending admin approval users
  static getPendingAdminApproval = asyncHandler(
    async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;

      const result = await UserRegistrationService.getPendingAdminApproval(
        pageNum,
        limitNum
      );

      const validated = paginatedUserRegistrationResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: 'Pending admin approval users retrieved successfully',
        success: true,
      });

      res.json(validated);
    }
  );

  // Get verified users (email and phone verified)
  static getVerifiedUsers = asyncHandler(
    async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;

      const result = await UserRegistrationService.getVerifiedUsers(
        pageNum,
        limitNum
      );

      const validated = paginatedUserRegistrationResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: 'Verified users retrieved successfully',
        success: true,
      });

      res.json(validated);
    }
  );
}
