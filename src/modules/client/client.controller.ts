import { ApiError, ApiResponse, asyncHandler } from '@utils-core';
import { NextFunction, Response } from 'express';
import {
  clientCreateDto,
  ClientFilterDto,
  clientSchemaResponse,
  PaginatedClientResponseDto,
} from './validators/client.dtos';
import { ClientValidators } from './validators/client.validators';
import { AuthenticatedRequest } from 'common/global.types';
import { ClientService } from './client.service';
import { StatusCodes } from 'http-status-codes';
import { clientAction, clientError, clientMessage } from './client.constants';

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
  static getPaginatedClient = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const validateParams = ClientFilterDto.parse(req.query);
      const { page, limit } = validateParams;
      if (!validateParams) {
        throw new ApiError(
          clientAction.GET_CLIENT,
          StatusCodes.BAD_REQUEST,
          clientError.INVALID_PARAMS,
          clientMessage.INVALID_PARAMS,
          [validateParams]
        );
      }
      const paginatedResponse = await ClientService.getPaginatedClient(
        page,
        limit,
        validateParams
      );

      const validResponse = PaginatedClientResponseDto.parse({
        statusCode: StatusCodes.OK,
        data: {
          items: paginatedResponse.data.items,
          meta: paginatedResponse.data.meta,
        },
        message: 'Clients retrieved successfully',
        success: true,
      });
      res.json(validResponse);
    }
  );
}
