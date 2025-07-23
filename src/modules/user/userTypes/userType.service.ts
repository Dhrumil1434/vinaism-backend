import { IUserTypeCreate } from './types/userType.type';
import { db } from '../../../db/mysql.db';
import { userTypes } from '../../../schema/userTypes.schema';
import {
  UserTypeAction,
  UserTypeErrorCode,
  UserTypeMessage,
} from './constants/userTypes.constant';
import { ApiError } from '@utils-core';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { getPagination } from '../../../utils/pagination.util';

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

  static async getPaginated(page = 1, limit = 10) {
    // Get total count
    const allRows = await db.select().from(userTypes);
    const total = allRows.length;
    const { skip, take, totalPages, currentPage } = getPagination(
      { page, limit },
      total
    );
    // Fetch paginated items
    const items = await db.select().from(userTypes).offset(skip).limit(take);
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
