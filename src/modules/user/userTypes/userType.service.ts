import { IUserTypeCreate } from './types/userType.type';
import { db } from '../../../db/mysql.db';
import { userTypes } from '../../../schema/userTypes.schema';
import {
  UserTypeAction,
  UserTypeErrorCode,
  UserTypeMessage,
} from './constants/userTypes.constant';
import { ApiError } from '@utils-core';
import { and, eq, like } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { getPagination } from '../../../utils/pagination.util';
import { UserTypeFilters } from './validators/userType.validator';

export class UserTypeService {
  static async create(data: IUserTypeCreate) {
    // Check for duplicate typeName
    const existing = await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.typeName, data.typeName));
    if (existing.length > 0) {
      throw new ApiError(
        UserTypeAction.CREATE_USER_TYPE,
        StatusCodes.CONFLICT,
        UserTypeErrorCode.CONFLICT,
        UserTypeMessage.CONFLICT,
        undefined,
        [
          {
            expectedField: 'userType',
            description: `As userType :  ${data.typeName} is already inserted try to insert different `,
          },
        ]
      );
    }
    const result = await db.insert(userTypes).values({
      typeName: data.typeName.toLowerCase(),
      description: data.description ?? null,
    });
    const insertedId = result[0].insertId;
    const insertedData = await db
      .select()
      .from(userTypes)
      .where(eq(userTypes.userTypeId, insertedId));
    return insertedData;
  }

  static async getPaginated(
    page = 1,
    limit = 10,
    filters: UserTypeFilters = {}
  ) {
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
}
