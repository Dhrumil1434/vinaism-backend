import z from 'zod';
import {
  userTypeCreateSchema,
  userTypeIdParamSchema,
  userTypeUpdateSchema,
} from '../validators/userType.validator';

export type IUserTypeCreate = z.infer<typeof userTypeCreateSchema>;
export type IUserTypeIdParamSchema = z.infer<typeof userTypeIdParamSchema>;
export type IUserTypeUpdateSchema = z.infer<typeof userTypeUpdateSchema>;
