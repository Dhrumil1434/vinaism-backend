import { db } from '../../../../db/mysql.db';
import { users } from '@schema-models';
import { and, eq, like } from 'drizzle-orm';
import { getPagination } from '../../../../utils/pagination.util';
import { UserTypeSchemaRepo } from '../../userTypes/userTypeSchema.repository';
import { UserRegistrationFilters } from '../registration.types';

// Interface for transformed user data
interface TransformedUser {
  userId: number;
  userName: string;
  profilePicture: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string | null;
  userType: any;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  admin_approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for paginated response
interface PaginatedResponse {
  items: TransformedUser[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

/**
 * Transform raw user data to include userType details
 */
export const transformUserData = async (
  userRow: any
): Promise<TransformedUser> => {
  const userType = userRow.userType
    ? await UserTypeSchemaRepo.getById(userRow.userType)
    : null;

  return {
    userId: userRow.userId,
    userName: userRow.userName,
    profilePicture: userRow.profilePicture,
    phoneNumber: userRow.phoneNumber,
    email: userRow.email,
    firstName: userRow.firstName,
    lastName: userRow.lastName,
    password: userRow.password,
    userType: userType ? userType[0] : null,
    is_active: userRow.is_active,
    email_verified: userRow.email_verified,
    phone_verified: userRow.phone_verified,
    admin_approved: userRow.admin_approved,
    createdAt: userRow.createdAt,
    updatedAt: userRow.updatedAt,
  };
};

/**
 * Transform multiple user rows
 */
export const transformUserRows = async (
  userRows: any[]
): Promise<TransformedUser[]> => {
  return Promise.all(userRows.map(transformUserData));
};

/**
 * Build filter conditions based on filters object
 */
export const buildFilterConditions = (
  filters: UserRegistrationFilters = {}
) => {
  const conditions = [];

  if (filters.userId !== undefined) {
    conditions.push(eq(users.userId, Number(filters.userId)));
  }
  if (filters.userName) {
    conditions.push(like(users.userName, `%${filters.userName}%`));
  }
  if (filters.email) {
    conditions.push(like(users.email, `%${filters.email}%`));
  }
  if (filters.phoneNumber) {
    conditions.push(like(users.phoneNumber, `%${filters.phoneNumber}%`));
  }
  if (filters.firstName) {
    conditions.push(like(users.firstName, `%${filters.firstName}%`));
  }
  if (filters.lastName) {
    conditions.push(like(users.lastName, `%${filters.lastName}%`));
  }
  if (filters.userType !== undefined) {
    conditions.push(eq(users.userType, Number(filters.userType)));
  }
  if (typeof filters.is_active === 'boolean') {
    conditions.push(eq(users.is_active, filters.is_active));
  }
  if (typeof filters.email_verified === 'boolean') {
    conditions.push(eq(users.email_verified, filters.email_verified));
  }
  if (typeof filters.phone_verified === 'boolean') {
    conditions.push(eq(users.phone_verified, filters.phone_verified));
  }
  if (typeof filters.admin_approved === 'boolean') {
    conditions.push(eq(users.admin_approved, filters.admin_approved));
  }

  return conditions;
};

/**
 * Get paginated users with filters
 */
export const getPaginatedUsers = async (
  page = 1,
  limit = 10,
  filters: UserRegistrationFilters = {}
): Promise<PaginatedResponse> => {
  const conditions = buildFilterConditions(filters);

  // Get all matching rows for total count
  let allRows;
  if (conditions.length > 0) {
    allRows = await db
      .select()
      .from(users)
      .where(and(...conditions));
  } else {
    allRows = await db.select().from(users);
  }

  const totalCount = allRows.length;
  const { skip, take, totalPages, currentPage } = getPagination(
    { page, limit },
    totalCount
  );

  // Get paginated results
  let paginatedRows;
  if (conditions.length > 0) {
    paginatedRows = await db
      .select()
      .from(users)
      .where(and(...conditions))
      .limit(take)
      .offset(skip);
  } else {
    paginatedRows = await db.select().from(users).limit(take).offset(skip);
  }

  const transformedRows = await transformUserRows(paginatedRows);

  return {
    items: transformedRows,
    meta: {
      total: totalCount,
      totalPages,
      currentPage,
      pageSize: take,
    },
  };
};

/**
 * Get all users (active and inactive)
 */
export const getAllUsers = async (): Promise<TransformedUser[]> => {
  const allUsers = await db.select().from(users);
  return transformUserRows(allUsers);
};

/**
 * Get users by specific status
 */
export const getUsersByStatus = async (
  status: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse> => {
  let conditions = [];

  switch (status.toLowerCase()) {
    case 'pending_verification':
      conditions = [
        eq(users.email_verified, false),
        eq(users.phone_verified, false),
      ];
      break;
    case 'verified':
      conditions = [
        eq(users.email_verified, true),
        eq(users.phone_verified, true),
        eq(users.admin_approved, false),
      ];
      break;
    case 'approved':
      conditions = [
        eq(users.email_verified, true),
        eq(users.phone_verified, true),
        eq(users.admin_approved, true),
        eq(users.is_active, true),
      ];
      break;
    case 'inactive':
      conditions = [eq(users.is_active, false)];
      break;
    case 'active':
      conditions = [eq(users.is_active, true)];
      break;
    default:
      throw new Error(`Invalid status: ${status}`);
  }

  // Get all matching rows for total count
  const allRows = await db
    .select()
    .from(users)
    .where(and(...conditions));
  const totalCount = allRows.length;
  const { skip, take, totalPages, currentPage } = getPagination(
    { page, limit },
    totalCount
  );

  // Get paginated results
  const paginatedRows = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(take)
    .offset(skip);

  const transformedRows = await transformUserRows(paginatedRows);

  return {
    items: transformedRows,
    meta: {
      total: totalCount,
      totalPages,
      currentPage,
      pageSize: take,
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (
  userId: number
): Promise<TransformedUser | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.userId, userId))
    .then((rows) => rows[0] || null);

  if (!user) return null;

  return transformUserData(user);
};

/**
 * Get pending admin approval users
 */
export const getPendingAdminApproval = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse> => {
  const conditions = [
    eq(users.email_verified, true),
    eq(users.phone_verified, true),
    eq(users.admin_approved, false),
  ];

  // Get all matching rows for total count
  const allRows = await db
    .select()
    .from(users)
    .where(and(...conditions));
  const totalCount = allRows.length;
  const { skip, take, totalPages, currentPage } = getPagination(
    { page, limit },
    totalCount
  );

  // Get paginated results
  const paginatedRows = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(take)
    .offset(skip);

  const transformedRows = await transformUserRows(paginatedRows);

  return {
    items: transformedRows,
    meta: {
      total: totalCount,
      totalPages,
      currentPage,
      pageSize: take,
    },
  };
};

/**
 * Get verified users (email and phone verified)
 */
export const getVerifiedUsers = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse> => {
  const conditions = [
    eq(users.email_verified, true),
    eq(users.phone_verified, true),
    eq(users.admin_approved, true),
    eq(users.is_active, true),
  ];

  // Get all matching rows for total count
  const allRows = await db
    .select()
    .from(users)
    .where(and(...conditions));
  const totalCount = allRows.length;
  const { skip, take, totalPages, currentPage } = getPagination(
    { page, limit },
    totalCount
  );

  // Get paginated results
  const paginatedRows = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(take)
    .offset(skip);

  const transformedRows = await transformUserRows(paginatedRows);

  return {
    items: transformedRows,
    meta: {
      total: totalCount,
      totalPages,
      currentPage,
      pageSize: take,
    },
  };
};

/**
 * Generic function to get users with custom conditions
 */
export const getUsersWithConditions = async (
  conditions: any[],
  page = 1,
  limit = 10
): Promise<PaginatedResponse> => {
  // Get all matching rows for total count
  const allRows = await db
    .select()
    .from(users)
    .where(and(...conditions));
  const totalCount = allRows.length;
  const { skip, take, totalPages, currentPage } = getPagination(
    { page, limit },
    totalCount
  );

  // Get paginated results
  const paginatedRows = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(take)
    .offset(skip);

  const transformedRows = await transformUserRows(paginatedRows);

  return {
    items: transformedRows,
    meta: {
      total: totalCount,
      totalPages,
      currentPage,
      pageSize: take,
    },
  };
};
