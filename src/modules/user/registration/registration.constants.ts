export enum UserRegistrationZodMessage {
  MIN_LENGHT_USER_NAME = 'User name must be at least 3 characters',
  PROFILE_PICTURE_TYPE = 'Profile picture must be a valid URL',
  INVALID_PHONE = 'Phone number must be 10-15 digits',
  PHONE_REQUIRED = 'Phone number is required',
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Email must be a valid email address',
  FIRST_NAME_REQUIRED = 'First name is required',
  LAST_NAME_REQUIRED = 'Last name is required',
  PASSWORD_MIN = 'Password must be at least 6 characters',
  USER_TYPE_REQUIRED = 'User type must be selected',
}
export enum UserRegistrationAction {
  REGISTER_USER = 'Registration of user',
  GET_USER = 'GETTING_USER_DATA',
}
export enum UserRegistrationErrorCode {
  INVALID_USER_TYPE = 'INVALID_USER_TYPE',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  FIRSTNAME_ALREADY_EXISTS = 'FIRSTNAME_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS = 'PHONE_ALREADY_EXISTS',
  INVALID_STATUS = 'INVALID_ENTERED_STATUS',
}
export enum UserRegistrationMessage {
  INVALID_USER_TYPE = 'User type is not exists',
  EMAIL_ALREADY_EXISTS = 'Email is already registered',
  FIRSTNAME_ALREADY_EXISTS = 'First name is already taken',
  PHONE_ALREADY_EXISTS = 'Phone number is already registered',
  GET_USERS_SUCCESS = 'Users retrieved successfully',
  GET_USERS_FAILED = 'Users are not found !',
}
