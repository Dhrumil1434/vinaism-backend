import { asyncHandler } from '@utils-core';
import { Request, Response } from 'express';
import { UserTypeService } from './userType.service';
import { userTypeRecordArraySchema } from './validators/userType.validator';
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
}
