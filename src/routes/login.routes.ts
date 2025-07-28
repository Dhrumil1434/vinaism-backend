import { validateBody } from '@middleware-core';
import { Router } from 'express';
import { LoginController } from 'modules/user/login/login.controller';
import { userLoginSchemaDto } from 'modules/user/login/validators/login.dto';
import { authenticateToken } from '@middleware-core';

const router = Router();

// POST /api/userLogin/ - Login user
router.post('/', validateBody(userLoginSchemaDto), LoginController.loginUser);

// POST /api/userLogin/refresh - Refresh access token (uses cookie)
router.post('/refresh', LoginController.refreshToken);

// POST /api/userLogin/logout - Logout user (uses cookie)
router.post('/logout', LoginController.logout);

// POST /api/userLogin/logout-all - Logout from all sessions (requires authentication)
router.post(
  '/logout-all',
  authenticateToken,
  LoginController.logoutFromAllSessions
);

// GET /api/userLogin/sessions - Get user's active sessions (requires authentication)
router.get(
  '/sessions',
  authenticateToken,
  LoginController.getUserActiveSessions
);

export default router;
