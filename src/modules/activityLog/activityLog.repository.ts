import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../../db/mysql.db';
import { activityLogs } from '../../schema/activityLog.schema';
import { CreateActivityLog } from './validators/activityLog.dto';

export class ActivityLogRepository {
  static async create(data: CreateActivityLog) {
    const [result] = await db.insert(activityLogs).values({
      userId: data.userId,
      actionType: data.actionType as any,
      resourceType: data.resourceType as any,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
    });

    return result;
  }

  static async listForUser(
    userId: number,
    opts: {
      page: number;
      limit: number;
      actionType?: string | undefined;
      resourceType?: string | undefined;
      startDate?: Date | undefined;
      endDate?: Date | undefined;
    }
  ) {
    const offset = (opts.page - 1) * opts.limit;

    let whereClause = eq(activityLogs.userId, userId);

    if (opts.actionType) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionType} = ${opts.actionType}`;
    }

    if (opts.resourceType) {
      whereClause = sql`${whereClause} AND ${activityLogs.resourceType} = ${opts.resourceType}`;
    }

    if (opts.startDate) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionTimestamp} >= ${opts.startDate}`;
    }

    if (opts.endDate) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionTimestamp} <= ${opts.endDate}`;
    }

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(whereClause);

    const items = await db
      .select()
      .from(activityLogs)
      .where(whereClause)
      .orderBy(desc(activityLogs.actionTimestamp))
      .limit(opts.limit)
      .offset(offset);

    return {
      items,
      total: totalResult?.count || 0,
    };
  }

  static async listAll(opts: {
    page: number;
    limit: number;
    userId?: number | undefined;
    actionType?: string | undefined;
    resourceType?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
  }) {
    const offset = (opts.page - 1) * opts.limit;

    let whereClause = sql`1=1`;

    if (opts.userId) {
      whereClause = sql`${whereClause} AND ${activityLogs.userId} = ${opts.userId}`;
    }

    if (opts.actionType) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionType} = ${opts.actionType}`;
    }

    if (opts.resourceType) {
      whereClause = sql`${whereClause} AND ${activityLogs.resourceType} = ${opts.resourceType}`;
    }

    if (opts.startDate) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionTimestamp} >= ${opts.startDate}`;
    }

    if (opts.endDate) {
      whereClause = sql`${whereClause} AND ${activityLogs.actionTimestamp} <= ${opts.endDate}`;
    }

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(whereClause);

    const items = await db
      .select()
      .from(activityLogs)
      .where(whereClause)
      .orderBy(desc(activityLogs.actionTimestamp))
      .limit(opts.limit)
      .offset(offset);

    return {
      items,
      total: totalResult?.count || 0,
    };
  }

  static async getById(logId: number) {
    const [result] = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.logId, logId));

    return result;
  }
}
