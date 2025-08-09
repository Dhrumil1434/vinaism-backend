import { Router } from 'express';
import passport from '../config/passport.config';
import { OAuthController } from '../modules/user/oAuth/oauth.controller';

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
// TODO: Add authentication middleware to these routes
router.post('/link', OAuthController.linkOAuthAccount);
router.delete('/unlink/:provider', OAuthController.unlinkOAuthAccount);
router.get('/connections', OAuthController.getOAuthConnections);

export default router;
