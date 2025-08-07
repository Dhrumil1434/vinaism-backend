import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';

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
      (accessToken, refreshToken, profile, done) => {
        // Placeholder: just pass the profile
        return done(null, profile);
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
      (accessToken, refreshToken, profile, done) => {
        // Placeholder: just pass the profile
        return done(null, profile);
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
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, idToken, profile, done) => {
        // Placeholder: just pass the profile
        return done(null, profile);
      }
    )
  );
};
