import z from 'zod';
import { UserRegistrationZodMessage } from '../registration.constants';
import { userTypeRecordSchema } from 'modules/user/userTypes/validators/userType.validator';

const userName = z
  .string()
  .min(3, UserRegistrationZodMessage.MIN_LENGHT_USER_NAME);
const profilePicture = z.string(
  UserRegistrationZodMessage.PROFILE_PICTURE_TYPE
);
const phoneNumber = z
  .string()
  .regex(/^[0-9]{10,15}$/, UserRegistrationZodMessage.INVALID_PHONE)
  .nonempty(UserRegistrationZodMessage.PHONE_REQUIRED);
const email = z
  .string()
  .nonempty(UserRegistrationZodMessage.EMAIL_REQUIRED)
  .email(UserRegistrationZodMessage.EMAIL_INVALID);
const firstName = z
  .string()
  .nonempty(UserRegistrationZodMessage.FIRST_NAME_REQUIRED);
const lastName = z
  .string()
  .nonempty(UserRegistrationZodMessage.LAST_NAME_REQUIRED);
const password = z.string().min(6, UserRegistrationZodMessage.PASSWORD_MIN);
const userType = z.coerce
  .number(UserRegistrationZodMessage.USER_TYPE_REQUIRED)
  .int();
const is_active = z.boolean().default(false);
export const UserRegistrationInsertSchemaDto = z.object({
  userName: userName,
  profilePicture: profilePicture,
  firstName: firstName,
  lastName: lastName,
  password: password,
  phoneNumber: phoneNumber,
  email: email,
  userType: userType,
  is_active: is_active,
});

export const UserRegistrationResponseSchema =
  UserRegistrationInsertSchemaDto.extend({
    userType: userTypeRecordSchema,
    createdAt: z.date().or(z.string()),
    updatedAt: z.date().or(z.string()),
  });
