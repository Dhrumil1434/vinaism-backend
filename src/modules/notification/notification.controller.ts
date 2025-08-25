import { asyncHandler } from '@utils-core';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotificationService } from './notification.service';
import {
  createNotificationSchema,
  markReadParamSchema,
  notificationCreatedApiResponseSchema,
  notificationMarkReadApiResponseSchema,
  notificationMarkAllReadApiResponseSchema,
} from './validators/notification.dto';
import { NotificationMessage } from './notification.constants';

export class NotificationController {
  static create = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const dto = createNotificationSchema.parse(req.body);
      await NotificationService.notify({
        type: dto.type,
        to: dto.to,
        message: dto.message,
      });

      const validated = notificationCreatedApiResponseSchema.parse({
        statusCode: StatusCodes.CREATED,
        data: { created: true },
        message: NotificationMessage.DEFAULT_CREATED,
        success: true,
      });
      return res.status(validated.statusCode).json(validated);
    }
  );

  static markRead = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req as any).user?.userId as number;
      const { id } = markReadParamSchema.parse(req.params);
      await NotificationService.markRead(userId, Number(id));

      const validated = notificationMarkReadApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { id: Number(id), isRead: true },
        message: NotificationMessage.MARKED_READ,
        success: true,
      });
      return res.status(validated.statusCode).json(validated);
    }
  );

  static markAllRead = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req as any).user?.userId as number;
      await NotificationService.markAllRead(userId);

      const validated = notificationMarkAllReadApiResponseSchema.parse({
        statusCode: StatusCodes.OK,
        data: { updated: true },
        message: NotificationMessage.MARKED_ALL_READ,
        success: true,
      });
      return res.status(validated.statusCode).json(validated);
    }
  );
}
