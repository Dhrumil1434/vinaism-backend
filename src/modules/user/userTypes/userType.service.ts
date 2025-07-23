import { IUserTypeCreate, IUserTypeUpdateSchema } from './types/userType.type';
import { db } from '../../../db/mysql.db';
import { userTypes } from '../../../schema/userTypes.schema';
import {
  UserTypeAction,
  UserTypeErrorCode,
} from './constants/userTypes.constant';
import { ApiError } from '@utils-core';
import { and, eq, like, not } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { getPagination } from '../../../utils/pagination.util';
import { UserTypeFilters } from './validators/userType.validator';
import { UserTypeSchemaRepo } from './userTypeSchema.repository';

export class UserTypeService {
  static async create(data: IUserTypeCreate) {
    // Check for duplicate active typeName
    const existingActive = await db
      .select()
      .from(userTypes)
      .where(
        and(
          eq(userTypes.typeName, data.typeName.toLowerCase()),
          eq(userTypes.is_active, true)
        )
      );
    if (existingActive.length > 0) {
      throw new ApiError(
        UserTypeAction.CREATE_USER_TYPE,
        StatusCodes.CONFLICT,
        UserTypeErrorCode.CONFLICT,
        'Active user type with this name already exists.'
      );
    }
    // If an inactive userType exists, reactivate and update it
    const existingInactive = await db
      .select()
      .from(userTypes)
      .where(
        and(
          eq(userTypes.typeName, data.typeName.toLowerCase()),
          eq(userTypes.is_active, false)
        )
      );
    if (existingInactive.length > 0 && existingInactive[0]) {
      await db
        .update(userTypes)
        .set({ is_active: true, description: data.description ?? null })
        .where(eq(userTypes.userTypeId, existingInactive[0].userTypeId));
      return await db
        .select()
        .from(userTypes)
        .where(eq(userTypes.userTypeId, existingInactive[0].userTypeId));
    }
    // Insert new user type
    const result = await db.insert(userTypes).values({
      typeName: data.typeName.toLowerCase(),
      description: data.description ?? null,
    });
    const insertedId = result[0].insertId;
    return await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.userTypeId, insertedId));
  }

  static async getPaginated(
    page = 1,
    limit = 10,
    filters: UserTypeFilters = {}
  ) {
    // By default, only fetch active records unless is_active is explicitly set
    if (typeof filters.is_active === 'undefined') {
      filters.is_active = true;
    }
    // Build dynamic where conditions
    const conditions = [];
    if (filters.userTypeId !== undefined) {
      conditions.push(eq(userTypes.userTypeId, Number(filters.userTypeId)));
    }
    if (filters.typeName) {
      conditions.push(like(userTypes.typeName, `%${filters.typeName}%`));
    }
    if (filters.description) {
      conditions.push(like(userTypes.description, `%${filters.description}%`));
    }
    if (typeof filters.is_active === 'boolean') {
      conditions.push(eq(userTypes.is_active, filters.is_active));
    }
    // Compose the where clause
    let query: Promise<any[]>;
    if (conditions.length > 0) {
      query = db
        .select()
        .from(userTypes)
        .where(and(...conditions));
    } else {
      query = db.select().from(userTypes);
    }
    // Get all matching rows for total count
    const rows = await query;
    const total = rows.length;
    const { skip, take, totalPages, currentPage } = getPagination(
      { page, limit },
      total
    );
    // Fetch paginated items
    const items = rows.slice(skip, skip + take);
    return {
      items,
      meta: {
        total,
        totalPages,
        currentPage,
        pageSize: take,
      },
    };
  }

  static async getAllUserTypes() {
    return await UserTypeSchemaRepo.getAll();
  }

  static async updateUserType(userTypeId: number, data: IUserTypeUpdateSchema) {
    if (data.typeName) {
      const duplicate = await db
        .select()
        .from(userTypes)
        .where(
          and(
            eq(userTypes.typeName, data.typeName.toLowerCase()),
            eq(userTypes.is_active, true),
            not(eq(userTypes.userTypeId, userTypeId))
          )
        );
      if (duplicate.length > 0) {
        throw new ApiError(
          UserTypeAction.UPDATE_USER_TYPE,
          StatusCodes.CONFLICT,
          UserTypeErrorCode.CONFLICT,
          'Another active user type with this name already exists.'
        );
      }
    }
    const result = await db
      .update(userTypes)
      .set({ ...data })
      .where(eq(userTypes.userTypeId, Number(userTypeId)));
    if (!result[0] || result[0].affectedRows === 0) {
      throw new ApiError(
        UserTypeAction.UPDATE_USER_TYPE,
        StatusCodes.NOT_FOUND,
        UserTypeErrorCode.NOT_FOUND,
        'User type not found or no changes made.'
      );
    }
    // Fetch and return the updated record
    const [updated] = await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.userTypeId, Number(userTypeId)));
    return updated;
  }

  static async softDeleteUserType(userTypeId: number) {
    const existing = await UserTypeSchemaRepo.getById(userTypeId);
    if (!existing[0]) {
      throw new ApiError(
        UserTypeAction.UPDATE_USER_TYPE,
        StatusCodes.NOT_FOUND,
        UserTypeErrorCode.NOT_FOUND,
        'User type not found.'
      );
    }
    // Toggle is_active
    const newActive = !existing[0].is_active;
    await db
      .update(userTypes)
      .set({ is_active: newActive })
      .where(eq(userTypes.userTypeId, userTypeId));
    return await UserTypeSchemaRepo.getById(userTypeId);
  }

  static async hardDeleteUserType(userTypeId: number) {
    const existing = await UserTypeSchemaRepo.getById(userTypeId);
    if (!existing[0]) {
      throw new ApiError(
        UserTypeAction.UPDATE_USER_TYPE,
        StatusCodes.NOT_FOUND,
        UserTypeErrorCode.NOT_FOUND,
        'User type not found.'
      );
    }
    await db.delete(userTypes).where(eq(userTypes.userTypeId, userTypeId));
    return { userTypeId, deleted: true };
  }
}
