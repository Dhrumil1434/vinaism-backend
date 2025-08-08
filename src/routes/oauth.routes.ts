import { Router } from 'express';
import passport from '../config/passport.config';
import { OAuthController } from '../modules/user/oAuth/oauth.controller';

const router = Router();

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  OAuthController.handleGoogleCallback
);
export default router;
