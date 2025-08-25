export const CaslErrorCode = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_ACTION: 'INVALID_ACTION',
  INVALID_SUBJECT: 'INVALID_SUBJECT',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
} as const;

export const CaslMessage = {
  AUTH_REQUIRED: 'Authentication required',
  FORBIDDEN: 'Forbidden: insufficient permissions',
  INVALID_ACTION: 'Invalid authorization action',
  INVALID_SUBJECT: 'Invalid authorization subject',
  AUTHORIZATION_ERROR: 'Authorization error',
} as const;

export const CaslActionMessage = {
  CREATE: 'You are not allowed to create this resource',
  READ: 'You are not allowed to view this resource',
  UPDATE: 'You are not allowed to update this resource',
  DELETE: 'You are not allowed to delete this resource',
  APPROVE: 'You are not allowed to approve this resource',
  ASSIGN: 'You are not allowed to assign this resource',
  REQUEST: 'You are not allowed to request this resource',
  SUBMIT: 'You are not allowed to submit this resource',
  AUTHENTICATE: 'You are not allowed to authenticate this resource',
  VERIFY: 'You are not allowed to verify this resource',
  LINK: 'You are not allowed to link this resource',
  UNLINK: 'You are not allowed to unlink this resource',
} as const;
