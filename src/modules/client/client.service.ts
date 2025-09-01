import { db } from 'db/mysql.db';
import { ClientSchemaRepo } from './clientSchema.repository';
import { ClientUtils } from './utils/client.utils';
import { IClientFilterDto, ICreateClientDto } from './validators/client.dtos';
import { client } from '@schema-models';
import { sql } from 'drizzle-orm';
import { getPagination } from 'utils/pagination.util';

export class ClientService {
  static async createClientRecord(
    clientData: ICreateClientDto,
    userId: number
  ) {
    const insertClient = await ClientSchemaRepo.createClient({
      ...clientData,
      userId,
    });
    return insertClient;
  }
  static async getPaginatedClient(
    page = 1,
    limit = 10,
    filters: IClientFilterDto
  ) {
    const whereClause = ClientUtils.buildWhere(filters);
    const orderBy = ClientUtils.buildOrderBy(filters.sortBy, filters.sortOrder);

    const result = await db
      .select({ count: sql<number>`COUNT(*) as count` })
      .from(client)
      .where(whereClause)
      .execute();

    const total = result[0]?.count ?? 0;

    const { skip, take, totalPages, currentPage } = getPagination(
      { page, limit },
      total
    );
    const items = await db
      .select()
      .from(client)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(take)
      .offset(skip);

    return {
      statusCode: 200,
      data: {
        items,
        meta: {
          total,
          totalPages,
          currentPage,
          pageSize: take,
        },
      },
    };
  }
}
