export enum UserTypeErrorCode {
  CONFLICT = 'USER_TYPE_ALREADY_EXISTS',
  BAD_REQUEST = 'USER_TYPE_BAD_REQUEST',
  NOT_FOUND = 'USER_TYPE_NOT_FOUND',
}
export enum UserTypeAction {
  CREATE_USER_TYPE = 'Creating user type !',
  UPDATE_USER_TYPE = 'Updating user type !',
}
export enum UserTypeMessage {
  CONFLICT = 'User type is already exists with the given name !',
  CREATE_USER_TYPE = 'User Type Created Succesfully ! ',
  GET_USER_TYPE = 'User Types fetched successfully !',
  UPDATE_USER_TYPE_SUCCESS = 'User Type Updated Successfully !',
  UPDATE_USER_TYPE_FAILED = 'User Type Is Not Updated !',
}
