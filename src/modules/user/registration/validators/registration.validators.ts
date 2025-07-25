// validators/validateUserTypeExists.ts
import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import {
  UserRegistrationAction,
  UserRegistrationErrorCode,
  UserRegistrationMessage,
} from '../registration.constants';
import { UserRegistrationSchemaRepo } from '../registrationSchema.repository';

export const validateUserTypeExists = async (userTypeId: number) => {
  const isExists =
    await UserRegistrationSchemaRepo.getActivatedUserTypeById(userTypeId);

  if (!isExists) {
    throw new ApiError(
      UserRegistrationAction.REGISTER_USER,
      StatusCodes.BAD_REQUEST,
      UserRegistrationErrorCode.INVALID_USER_TYPE,
      UserRegistrationMessage.INVALID_USER_TYPE,
      [
        {
          field: 'userType',
          message: `Entered UserType ${userTypeId} is invalid`,
        },
      ],
      [
        {
          expectedField: 'userType',
          description: 'user type should be valid one',
        },
      ]
    );
  }

  return true; // Optionally return true to indicate validation success
};

export const validateUniqueEmail = async (email: string) => {
  const user = await UserRegistrationSchemaRepo.getUserByEmail(email);
  if (user) {
    throw new ApiError(
      'REGISTER_USER',
      StatusCodes.BAD_REQUEST,
      UserRegistrationErrorCode.EMAIL_ALREADY_EXISTS,
      UserRegistrationMessage.EMAIL_ALREADY_EXISTS,
      [
        {
          field: 'email',
          message: UserRegistrationMessage.EMAIL_ALREADY_EXISTS,
        },
      ]
    );
  }
};

export const validateUniquePhoneNumber = async (phoneNumber: string) => {
  const user =
    await UserRegistrationSchemaRepo.getUserByPhoneNumber(phoneNumber);
  if (user) {
    throw new ApiError(
      'REGISTER_USER',
      StatusCodes.BAD_REQUEST,
      UserRegistrationErrorCode.PHONE_ALREADY_EXISTS,
      UserRegistrationMessage.PHONE_ALREADY_EXISTS,
      [
        {
          field: 'phoneNumber',
          message: UserRegistrationMessage.PHONE_ALREADY_EXISTS,
        },
      ]
    );
  }
};
