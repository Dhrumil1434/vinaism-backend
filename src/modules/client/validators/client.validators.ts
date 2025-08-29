import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { clientAction, clientError, clientMessage } from '../client.constants';
import { ClientSchemaRepo } from '../clientSchema.repository';
import { IClientResponseDto, ICreateClientDto } from './client.dtos';

export class ClientValidators {
  static async validateGSTUniqueness(
    gstNumber: ICreateClientDto['gstNumber'],
    clientId?: IClientResponseDto['clientId']
  ) {
    const existingClient = await ClientSchemaRepo.isGstNumberExistAcrossClients(
      gstNumber,
      clientId
    );
    if (existingClient) {
      throw new ApiError(
        clientAction.CREATE_CLIENT,
        StatusCodes.CONFLICT,
        clientError.GST_NUMBER_CONFLICT,
        clientMessage.GST_NUMBER_CONFLICT
      );
    }
  }
  static async validateUserClientUniqueness(
    userId: IClientResponseDto['userId'],
    clientId: IClientResponseDto['clientId']
  ) {
    const isUserClientUnique =
      await ClientSchemaRepo.validateUserClientUniqueness(userId, clientId);
    if (isUserClientUnique) {
      throw new ApiError(
        clientAction.CREATE_CLIENT,
        StatusCodes.CONFLICT,
        clientError.CLIENT_CONFLICT,
        clientMessage.CLIENT_CONFLICT
      );
    }
  }
  // ✅ Check if mobile is already used by another client
  static async validateMobileUniqueness(
    mobile: IClientResponseDto['officeMobileNumber'],
    excludeClientId?: IClientResponseDto['clientId']
  ) {
    const excludeClient = await ClientSchemaRepo.validateMobileUniqueness(
      mobile,
      excludeClientId
    );
    if (excludeClient) {
      throw new ApiError(
        clientAction.CREATE_CLIENT,
        StatusCodes.CONFLICT,
        clientError.CLIENT_MOBILE_NUMBER_CONFLICT,
        clientMessage.CLIENT_MOBILE_NUMBER_CONFLICT
      );
    }
  }
}
