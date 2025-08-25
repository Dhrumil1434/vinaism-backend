// Centralized CASL enums and types for actions, subjects, and personas
// Keep these aligned with actual modules in src/modules and tables in src/schema

// Actions represent what a user can do. Keep them generic and reusable.
export enum Action {
  MANAGE = 'manage', // wildcard for all actions on a subject
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve', // explicit business action (approvals)
  LINK = 'link', // e.g., link/unlink OAuth accounts
  UNLINK = 'unlink',
  ASSIGN = 'assign', // assign tasks, ownership
  REQUEST = 'request', // request resources (e.g., ID cards)
  SUBMIT = 'submit', // submit price forms, documents
  AUTHENTICATE = 'authenticate', // authenticate/authorize vendor orders
  VERIFY = 'verify', // verify phone/otp, documents
}

export enum Subject {
  ALL = 'all',

  // Core domain
  PROJECT = 'Project',
  PROJECT_SPACE_DETAILS = 'ProjectSpaceDetails',
  TASK_ASSIGNMENT = 'TaskAssignment',
  TIME_LOG = 'TimeLog',
  ID_CARD = 'IdCard',
  ADDRESS = 'Address',
  CONTACT = 'Contact',

  // Commerce / procurement
  VENDOR_ORDER = 'VendorOrder',
  VENDOR_ORDER_ITEMS = 'VendorOrderItems',
  PRICE_FORM = 'PriceForm',
  VENDOR_CATEGORY = 'VendorCategory',

  // Parties
  CLIENT = 'Client',
  VENDOR = 'Vendor',
  SUPPLIER = 'Supplier',
  DESIGNER = 'Designer',
  WORKER = 'Worker',

  // System/infra
  NOTIFICATION = 'Notification',
  ACTIVITY_LOG = 'ActivityLog',
  USER = 'User',
  USER_TYPE = 'UserType',
  USER_ROLE = 'UserRole',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  ROLE_PERMISSION = 'RolePermission',
  LOGIN_SESSION = 'LoginSession',
  LOGIN_ATTEMPT = 'LoginAttempt',
  OAUTH_METADATA = 'OAuthMetadata',
}
// Business personas (user types) used to derive default abilities.
// These are distinct from system roles but can map to them.
export enum UserTypes {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin',
  CLIENT = 'client',
  ACCOUNTANT = 'accountant',
  ONSITE_COORDINATOR = 'onsite-coordinator',
  DESIGNER = 'designer',
  VENDOR = 'vendor',
  SUPPLIER = 'supplier',
  WORKER = 'worker',
}

// Helper to normalize various shapes of userType in tokens or DB
export function resolvePersonaName(userType: unknown): string {
  if (!userType) return '';
  if (typeof userType === 'string') return userType.toLowerCase();
  if (typeof userType === 'number') return String(userType);
  if (typeof userType === 'object' && (userType as any).typeName) {
    return String((userType as any).typeName).toLowerCase();
  }
  return '';
}
