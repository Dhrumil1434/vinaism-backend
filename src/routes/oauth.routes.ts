import { Router } from 'express';
import passport from '../config/passport.config';
import { OAuthController } from '../modules/user/oAuth/oauth.controller';
import {
  validateOAuthLinkRequest,
  requireAuthentication,
} from '../modules/user/oAuth/middleware/oauth.validation.middleware';

const router = Router();

// Google OAuth Routes with optional userTypeId parameter
router.get('/google', OAuthController.initiateGoogleOAuth);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  OAuthController.handleGoogleCallback
);

// OAuth Management Routes (require authentication)
router.post(
  '/link',
  requireAuthentication,
  validateOAuthLinkRequest,
  OAuthController.linkOAuthAccount
);
router.delete(
  '/unlink/:provider',
  requireAuthentication,
  OAuthController.unlinkOAuthAccount
);
router.get(
  '/connections',
  requireAuthentication,
  OAuthController.getOAuthConnections
);

export default router;
