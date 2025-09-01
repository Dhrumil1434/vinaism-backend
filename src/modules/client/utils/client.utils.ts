import { and, asc, desc, eq, like, SQL } from 'drizzle-orm';
import { client } from '@schema-models';
import { IClientFilterDto } from '../validators/client.dtos';

export class ClientUtils {
  /**
   * Build WHERE clause for client filters
   */
  static buildWhere(filters: IClientFilterDto): SQL | undefined {
    const conditions = [];

    if (filters.clientId) {
      conditions.push(eq(client.clientId, Number(filters.clientId)));
    }
    if (filters.userId) {
      conditions.push(eq(client.userId, Number(filters.userId)));
    }
    if (filters.billingFirmName) {
      conditions.push(
        like(client.billingFirmName, `%${filters.billingFirmName}%`)
      );
    }
    if (filters.officeMobileNumber) {
      conditions.push(
        like(client.officeMobileNumber, `%${filters.officeMobileNumber}%`)
      );
    }
    if (typeof filters.is_active === 'boolean') {
      conditions.push(eq(client.is_active, filters.is_active));
    }

    return conditions.length ? and(...conditions) : undefined;
  }

  /**
   * Build ORDER BY clause for sorting
   */
  static buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    if (!sortBy) return desc(client.createdAt);

    const column = (client as any)[sortBy];
    return sortOrder === 'asc' ? asc(column) : desc(column);
  }
}
