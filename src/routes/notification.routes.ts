import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAbility } from '../middlewares/ability.middleware';
import { NotificationController } from '../modules/notification/notification.controller';
import { Action, Subject } from '../modules/auth/casl/casl.enum';

const router = Router();

router.patch(
  '/:id/read',
  authenticateToken,
  requireAbility(Action.UPDATE, Subject.NOTIFICATION),
  NotificationController.markRead
);

router.patch(
  '/read-all',
  authenticateToken,
  requireAbility(Action.UPDATE, Subject.NOTIFICATION),
  NotificationController.markAllRead
);

router.post(
  '/',
  authenticateToken,
  requireAbility(Action.CREATE, Subject.NOTIFICATION),
  NotificationController.create
);

export default router;
