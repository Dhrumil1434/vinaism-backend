import { asyncHandler } from '@utils-core';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ActivityLogService } from './activityLog.service';
import {
  listActivityLogsQuerySchema,
  activityLogListApiResponseSchema,
  activityLogCreatedApiResponseSchema,
} from './validators/activityLog.dto';
import { ActivityLogMessage } from './activityLog.constants';

export class ActivityLogController {
  static listMine = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req as any).user?.userId as number;
      const q = listActivityLogsQuerySchema.parse(req.query);

      const { items, total } = await ActivityLogService.listForUser(userId, {
        page: parseInt(q.page || '1', 10),
        limit: parseInt(q.limit || '10', 10),
        actionType: q.actionType || undefined,
        resourceType: q.resourceType || undefined,
      });

      const validated = activityLogListApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { items, page: q.page, limit: q.limit, total },
        message: ActivityLogMessage.CAPTURED,
        success: true,
      });

      return res.status(validated.statusCode).json(validated);
    }
  );

  static listAll = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const q = listActivityLogsQuerySchema.parse(req.query);

      const { items, total } = await ActivityLogService.listAll({
        page: parseInt(q.page || '1', 10),
        limit: parseInt(q.limit || '10', 10),
        actionType: q.actionType || undefined,
        resourceType: q.resourceType || undefined,
      });

      const validated = activityLogListApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { items, page: q.page, limit: q.limit, total },
        message: ActivityLogMessage.CAPTURED,
        success: true,
      });

      return res.status(validated.statusCode).json(validated);
    }
  );

  static getById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const logId = Number(id);

      if (isNaN(logId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          statusCode: StatusCodes.BAD_REQUEST,
          data: null,
          message: 'Invalid log ID',
          success: false,
        });
      }

      const log = await ActivityLogService.getById(logId);

      const validated = activityLogCreatedApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { logId: log.logId, captured: true },
        message: ActivityLogMessage.CAPTURED,
        success: true,
      });

      return res.status(validated.statusCode).json(validated);
    }
  );
}
