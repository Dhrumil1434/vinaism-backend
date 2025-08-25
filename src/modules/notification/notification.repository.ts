import { db } from '../../db/mysql.db';
import { notifications } from '@schema-models';
import { and, eq } from 'drizzle-orm';

export class NotificationRepository {
  static async create(data: {
    userId: number;
    notificationType: string;
    message: string;
  }) {
    const now = new Date().toISOString();
    const [res] = await db.insert(notifications).values({
      userId: data.userId,
      notificationType: data.notificationType as any,
      message: data.message,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    });
    return res;
  }

  static async markRead(userId: number, id: number) {
    const [res] = await db
      .update(notifications)
      .set({ isRead: true, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(notifications.notificationId, id),
          eq(notifications.userId, userId)
        )
      );
    return res;
  }

  static async markAllRead(userId: number) {
    const [res] = await db
      .update(notifications)
      .set({ isRead: true, updatedAt: new Date().toISOString() })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );
    return res;
  }
}
