import { Router } from 'express';
import passport from '../config/passport.config';
import { OAuthController } from '../modules/user/oAuth/oauth.controller';
import { validateOAuthLinkRequest } from '../modules/user/oAuth/middleware/oauth.validation.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

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
  authenticateToken,
  validateOAuthLinkRequest,
  OAuthController.linkOAuthAccount
);
router.delete(
  '/unlink/:provider',
  authenticateToken,
  OAuthController.unlinkOAuthAccount
);
router.get(
  '/connections',
  authenticateToken,
  OAuthController.getOAuthConnections
);

// Phone Verification Routes (require authentication)
router.post(
  '/verify-phone',
  authenticateToken,
  OAuthController.initiatePhoneVerification
);
router.post(
  '/verify-phone/otp',
  authenticateToken,
  OAuthController.verifyPhoneOtp
);

export default router;
