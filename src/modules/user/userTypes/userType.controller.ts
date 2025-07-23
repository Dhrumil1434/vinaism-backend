import { ApiResponse, asyncHandler } from '@utils-core';
import { Request, Response } from 'express';
import { UserTypeService } from './userType.service';
import {
  paginatedUserTypeResponseSchema,
  userTypeRecordArraySchema,
  userTypeFilterSchema,
  userTypeRecordSchema,
} from './validators/userType.validator';
import { StatusCodes } from 'http-status-codes';
import { UserTypeMessage } from './constants/userTypes.constant';

export class UserTypeController {
  // Create user type (handles duplicate/reactivation in service)
  static createUserType = asyncHandler(async (req: Request, res: Response) => {
    const createdUserType = await UserTypeService.create(req.body);
    const validated = userTypeRecordArraySchema.parse(createdUserType);
    const response = new ApiResponse(
      StatusCodes.CREATED,
      validated,
      UserTypeMessage.CREATE_USER_TYPE
    );
    res.status(response.statusCode).json(response);
  });

  // Get paginated (active by default)
  static getPaginatedUserTypes = asyncHandler(
    async (req: Request, res: Response) => {
      const { page, limit, ...rest } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const filters = userTypeFilterSchema.parse(rest);
      const result = await UserTypeService.getPaginated(
        pageNum,
        limitNum,
        filters
      );
      const validated = paginatedUserTypeResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: UserTypeMessage.GET_USER_TYPE,
        success: true,
      });
      res.json(validated);
    }
  );

  // Get all (active + inactive)
  static getAllUserTypes = asyncHandler(
    async (_req: Request, res: Response) => {
      const allUserTypes = await UserTypeService.getAllUserTypes();
      const validated = userTypeRecordArraySchema.parse(allUserTypes);
      const response = new ApiResponse(
        StatusCodes.OK,
        validated,
        'All user types (active and inactive)'
      );
      res.status(response.statusCode).json(response);
    }
  );

  // Update user type (handles duplicate check in service)
  static updateUserTypes = asyncHandler(async (req: Request, res: Response) => {
    const { userTypeId } = req.params;
    const data = req.body;
    const updated = await UserTypeService.updateUserType(
      Number(userTypeId),
      data
    );
    const validate = userTypeRecordSchema.parse(updated);
    const response = new ApiResponse(
      StatusCodes.OK,
      validate,
      UserTypeMessage.UPDATE_USER_TYPE_SUCCESS
    );
    res.status(response.statusCode).json(response);
  });

  // Soft delete/toggle is_active (no body param needed, toggles current state)
  static softDeleteUserType = asyncHandler(
    async (req: Request, res: Response) => {
      const { userTypeId } = req.params;
      const updated = await UserTypeService.softDeleteUserType(
        Number(userTypeId)
      );

      const validate = userTypeRecordArraySchema.parse(updated);
      const response = new ApiResponse(
        StatusCodes.OK,
        validate,
        'User type is_active toggled.'
      );
      res.status(response.statusCode).json(response);
    }
  );

  // Hard delete
  static hardDeleteUserType = asyncHandler(
    async (req: Request, res: Response) => {
      const { userTypeId } = req.params;
      const result = await UserTypeService.hardDeleteUserType(
        Number(userTypeId)
      );
      const response = new ApiResponse(
        StatusCodes.OK,
        result,
        'User type permanently deleted.'
      );
      res.status(response.statusCode).json(response);
    }
  );
}
