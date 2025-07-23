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
  static createUserType = asyncHandler(async (req: Request, res: Response) => {
    const createdUserType = await UserTypeService.create(req.body);
    // Validate the raw DB record with Zod before sending
    const validated = userTypeRecordArraySchema.parse(createdUserType);
    res.json({
      statusCode: StatusCodes.CREATED,
      data: validated,
      message: UserTypeMessage.CREATE_USER_TYPE,
      success: true,
    });
  });
  // ... existing code ...
  static getPaginatedUserTypes = asyncHandler(
    async (req: Request, res: Response) => {
      const { page, limit, ...rest } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      // Only pass the rest (potential filters) to Zod
      const filters = userTypeFilterSchema.parse(rest);
      console.log(filters);
      const result = await UserTypeService.getPaginated(
        pageNum,
        limitNum,
        filters
      );
      // Validate the response
      const validated = paginatedUserTypeResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: UserTypeMessage.GET_USER_TYPE,
        success: true,
      });
      res.json(validated);
    }
  );
  // getting start with the update user type
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
}
