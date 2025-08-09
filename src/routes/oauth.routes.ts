import { Router } from 'express';
import passport from '../config/passport.config';
import { OAuthController } from '../modules/user/oAuth/oauth.controller';
import {
  validateOAuthLinkRequest,
  requireAuthentication,
} from '../modules/user/oAuth/middleware/oauth.validation.middleware';

const router = Router();

// OAuth failure route
router.get('/failure', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'OAuth authentication failed',
    error: 'Authentication was cancelled or failed. Please try again.',
  });
});

// Google OAuth Routes with optional userTypeId parameter
router.get('/google', OAuthController.initiateGoogleOAuth);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure', // Better error handling
    session: false, // We handle our own JWT tokens, don't need session
  }),
  OAuthController.handleGoogleCallback
);

// Facebook OAuth Routes with optional userTypeId parameter
router.get('/facebook', OAuthController.initiateFacebookOAuth);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/auth/failure', // Better error handling
    session: false, // We handle our own JWT tokens, don't need session
  }),
  OAuthController.handleFacebookCallback
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
