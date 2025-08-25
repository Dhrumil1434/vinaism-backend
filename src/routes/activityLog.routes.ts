import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAbility } from '../middlewares/ability.middleware';
import { Action, Subject } from '../modules/auth/casl/casl.enum';
import { ActivityLogController } from '../modules/activityLog/activityLog.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user's own activity logs
router.get(
  '/',
  requireAbility(Action.READ, Subject.ACTIVITY_LOG),
  ActivityLogController.listMine
);

// Get specific activity log by ID
router.get(
  '/:id',
  requireAbility(Action.READ, Subject.ACTIVITY_LOG),
  ActivityLogController.getById
);

// Get all activity logs (admin only)
router.get(
  '/admin/all',
  requireAbility(Action.READ, Subject.ACTIVITY_LOG),
  ActivityLogController.listAll
);

export default router;
