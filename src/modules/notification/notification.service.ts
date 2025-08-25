import { ApiError } from '@utils-core';
import { StatusCodes } from 'http-status-codes';
import { NotificationRepository } from './notification.repository';
import {
  NotificationAction,
  NotificationErrorCode,
  NotificationKind,
} from './notification.constants';

export class NotificationService {
  static async notify(args: {
    type: NotificationKind;
    to: { userId: number };
    message: string;
  }) {
    if (!args.to?.userId) {
      throw new ApiError(
        NotificationAction.CREATE,
        StatusCodes.BAD_REQUEST,
        NotificationErrorCode.INVALID_TARGET,
        'Notification target is required'
      );
    }

    await NotificationRepository.create({
      userId: args.to.userId,
      notificationType: args.type,
      message: args.message,
    });

    return { success: true };
  }

  static async markRead(userId: number, id: number) {
    await NotificationRepository.markRead(userId, id);
    return { success: true };
  }

  static async markAllRead(userId: number) {
    await NotificationRepository.markAllRead(userId);
    return { success: true };
  }
}
