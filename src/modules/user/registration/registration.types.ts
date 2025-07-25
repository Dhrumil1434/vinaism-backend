import z from 'zod';
import { UserRegistrationInsertSchemaDto } from './validators/registration.dtos';
import { userTypeIdParamSchema } from '../userTypes/validators/userType.validator';

export type IUserRegistrationInsert = z.infer<
  typeof UserRegistrationInsertSchemaDto
>;
export type IUserTypeId = z.infer<typeof userTypeIdParamSchema>;
