import { ApiResponse, asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import {
  UserRegistrationInsertSchemaDto,
  UserRegistrationResponseSchema,
} from './validators/registration.dtos';

import path from 'path';
import { configDotenv } from 'dotenv';
import { generateFileName, saveBufferedFile } from '@utils-core';
import {
  validateUniqueEmail,
  validateUniquePhoneNumber,
  validateUserTypeExists,
} from './validators/registration.validators';
import { UserRegistrationService } from './registration.service';
import { StatusCodes } from 'http-status-codes';
import { UserRegistrationMessage } from './registration.constants';
configDotenv();

export class UserRegistrationController {
  static registerUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const validateInsert = z.parse(UserRegistrationInsertSchemaDto, req.body);
      const uploadDir = process.env['UPLOAD_DIRECTORY'] || 'public/uploads';

      // Only handle file if present
      if (req.file && req.file.buffer) {
        const fileName = generateFileName(req.file.originalname);
        const filePath = path.join(uploadDir, fileName);
        await saveBufferedFile(req.file.buffer, filePath);
      }
      await validateUserTypeExists(validateInsert.userType);
      await validateUniqueEmail(validateInsert.email);
      await validateUniquePhoneNumber(validateInsert.phoneNumber);
      const insertedRecord =
        await UserRegistrationService.registerUser(validateInsert);
      const validateResponse = z.parse(
        UserRegistrationResponseSchema,
        insertedRecord
      );
      const response = new ApiResponse(
        StatusCodes.CREATED,
        validateResponse,
        UserRegistrationMessage.REGISTERED_SUCCESSFULLY
      );
      res.status(response.statusCode).json(response);
    }
  );
}
