import { Router } from 'express';
import { AdminController } from '../modules/user/registration/admin.controller';
import { validateBody } from '../middlewares/zodSchema.validator.middleware';

const router = Router();

// Get pending approvals
router.get('/pending-approvals', AdminController.getPendingApprovals);

// Approve user
router.post('/approve-user', validateBody, AdminController.approveUser);

// Reject user
router.post('/reject-user', validateBody, AdminController.rejectUser);

export default router;
