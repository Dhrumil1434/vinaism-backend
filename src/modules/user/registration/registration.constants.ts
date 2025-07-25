export enum UserRegistrationZodMessage {
  MIN_LENGHT_USER_NAME = 'Username must be at least 3 characters',
  PROFILE_PICTURE_TYPE = 'Profile picture must be a valid URL',
  PHONE_REQUIRED = 'Phone number is required',
  INVALID_PHONE = 'Phone number must be at least 10 digits',
  EMAIL_INVALID = 'Invalid email format',
  FIRST_NAME_REQUIRED = 'First name is required',
  LAST_NAME_REQUIRED = 'Last name is required',
  PASSWORD_MIN = 'Password must be at least 6 characters',
  USER_TYPE_REQUIRED = 'User type must be selected',
  EMAIL_REQUIRED = 'Email is required',
}
export enum UserRegistrationAction {
  'REGISTER_USER' = 'Registration of user',
}
export enum UserRegistrationErrorCode {
  INVALID_USER_TYPE = 'INVALID_USER_TYPE',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  FIRSTNAME_ALREADY_EXISTS = 'FIRSTNAME_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS = 'PHONE_ALREADY_EXISTS',
}
export enum UserRegistrationMessage {
  INVALID_USER_TYPE = 'User type is not exists',
  EMAIL_ALREADY_EXISTS = 'Email is already registered',
  FIRSTNAME_ALREADY_EXISTS = 'First name is already taken',
  PHONE_ALREADY_EXISTS = 'Phone number is already registered',
  REGISTERED_SUCCESSFULLY = 'User Registered Successfully !',
}
