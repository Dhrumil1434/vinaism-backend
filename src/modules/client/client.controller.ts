import { ApiResponse, asyncHandler } from '@utils-core';
import { NextFunction, Response } from 'express';
import {
  clientCreateDto,
  clientSchemaResponse,
} from './validators/client.dtos';
import { ClientValidators } from './validators/client.validators';
import { AuthenticatedRequest } from 'common/global.types';
import { ClientService } from './client.service';
import { StatusCodes } from 'http-status-codes';
import { clientMessage } from './client.constants';

export class ClientController {
  static createClientRecord = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const requestBody = clientCreateDto.parse(req.body);
      const userId = Number(req.user?.userId);
      await ClientValidators.validateGSTUniqueness(
        requestBody.gstNumber,
        userId
      );
      await ClientValidators.validateMobileUniqueness(
        requestBody.officeMobileNumber,
        userId
      );

      const insertedClient = await ClientService.createClientRecord(
        requestBody,
        userId
      );
      const validResponse = clientSchemaResponse.parse(insertedClient);
      const response = new ApiResponse(
        StatusCodes.OK,
        validResponse,
        clientMessage.CREATED
      );
      res.status(response.statusCode).json(response);
    }
  );
}
