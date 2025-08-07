import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { OAuthProvider } from '../modules/user/oAuth/types/oauth.types';

// OAuth configuration for each provider
const oauthConfig = {
  google: {
    clientID: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackURL: process.env['GOOGLE_REDIRECT_URI']!,
  },
  facebook: {
    clientID: process.env['FACEBOOK_CLIENT_ID']!,
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET']!,
    callbackURL: process.env['FACEBOOK_REDIRECT_URI']!,
    profileFields: ['id', 'emails', 'name', 'picture'],
  },
  apple: {
    clientID: process.env['APPLE_CLIENT_ID']!,
    teamID: process.env['APPLE_TEAM_ID']!,
    keyID: process.env['APPLE_KEY_ID']!,
    privateKeyLocation: process.env['APPLE_PRIVATE_KEY_PATH']!,
    callbackURL: process.env['APPLE_REDIRECT_URI']!,
    passReqToCallback: true,
  },
};

export const configurePassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: oauthConfig.google.clientID,
        clientSecret: oauthConfig.google.clientSecret,
        callbackURL: oauthConfig.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Import OAuthService here to avoid circular dependencies
          const { OAuthService } = await import(
            '../modules/user/oAuth/oauth.service'
          );

          // Process the OAuth profile and create/find user
          const oauthResult = await OAuthService.findOrCreateOAuthUser(
            'google' as OAuthProvider,
            {
              id: profile.id,
              email: profile.emails?.[0]?.value || '',
              name: {
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
              },
              photos: profile.photos,
              provider: 'google',
            },
            accessToken,
            refreshToken
          );

          return done(null, oauthResult.user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Facebook OAuth Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: oauthConfig.facebook.clientID,
        clientSecret: oauthConfig.facebook.clientSecret,
        callbackURL: oauthConfig.facebook.callbackURL,
        profileFields: oauthConfig.facebook.profileFields,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { OAuthService } = await import(
            '../modules/user/oAuth/oauth.service'
          );

          const oauthResult = await OAuthService.findOrCreateOAuthUser(
            'facebook' as OAuthProvider,
            {
              id: profile.id,
              email: profile.emails?.[0]?.value || '',
              name: {
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
              },
              photos: profile.photos,
              provider: 'facebook',
            },
            accessToken,
            refreshToken
          );

          return done(null, oauthResult.user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Apple Sign-In Strategy
  passport.use(
    new AppleStrategy(
      {
        clientID: oauthConfig.apple.clientID,
        teamID: oauthConfig.apple.teamID,
        keyID: oauthConfig.apple.keyID,
        privateKeyLocation: oauthConfig.apple.privateKeyLocation,
        callbackURL: oauthConfig.apple.callbackURL,
        passReqToCallback: oauthConfig.apple.passReqToCallback,
      },
      async (req, accessToken, refreshToken, idToken, profile, done) => {
        try {
          const { OAuthService } = await import(
            '../modules/user/oAuth/oauth.service'
          );

          // Apple provides user info in the initial response if it's the first login
          let userInfo = {
            id: profile.id,
            email: profile.email || '',
            name: profile.name,
            photos: [],
            provider: 'apple' as OAuthProvider,
          };

          // If Apple provided user info in the initial response
          if (req.body?.user) {
            userInfo = {
              ...userInfo,
              email: req.body.user.email || userInfo.email,
              name: req.body.user.name || userInfo.name,
            };
          }

          const oauthResult = await OAuthService.findOrCreateOAuthUser(
            'apple' as OAuthProvider,
            userInfo,
            accessToken,
            refreshToken
          );

          return done(null, oauthResult.user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
