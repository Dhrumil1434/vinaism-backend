import { asyncHandler } from '@utils-core';
import { Request, Response } from 'express';
import { UserTypeService } from './userType.service';
import {
  paginatedUserTypeResponseSchema,
  userTypeRecordArraySchema,
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
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const result = await UserTypeService.getPaginated(page, limit);
      // Validate the response
      const validated = paginatedUserTypeResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: result,
        message: 'User types fetched successfully',
        success: true,
      });
      res.json(validated);
    }
  );
  // ... existing code ...
}
