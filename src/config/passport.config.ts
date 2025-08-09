import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import {
  OAUTH_PROVIDERS,
  OAuthConfig,
} from '../modules/user/oAuth/oauth.constants.js';

// Initialize Passport strategies only if environment variables are available
const initializePassportStrategies = () => {
  // Check if Google OAuth environment variables are available
  if (
    process.env['GOOGLE_CLIENT_ID'] &&
    process.env['GOOGLE_CLIENT_SECRET'] &&
    process.env['GOOGLE_CALLBACK_URL']
  ) {
    // Google OAuth Strategy Configuration
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env['GOOGLE_CLIENT_ID']!,
          clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
          callbackURL: process.env['GOOGLE_CALLBACK_URL']!,
          scope: [...OAuthConfig.GOOGLE_SCOPES],
          state: true, // Enable CSRF protection
        },
        async (
          accessToken: string,
          refreshToken: string | undefined,
          profile: any,
          done: any
        ) => {
          try {
            // Extract user information from Google profile
            const userProfile = {
              provider: OAUTH_PROVIDERS.GOOGLE,
              providerId: profile.id,
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              displayName: profile.displayName,
              picture: profile.photos?.[0]?.value,
              phoneNumber: profile.phoneNumbers?.[0]?.value, // Phone number if available
              accessToken,
              refreshToken,
              providerData: profile._json,
            };

            // Here you would typically:
            // 1. Check if user exists in your database
            // 2. Create new user if doesn't exist
            // 3. Update existing user if needed
            // 4. Return the user object

            // For now, we'll pass the profile data to be handled by your OAuth service
            return done(null, userProfile);
          } catch (error) {
            console.error('Google OAuth Strategy Error:', error);
            return done(error as Error, null);
          }
        }
      )
    );
  } else {
    console.warn(
      'Google OAuth environment variables not found. Google OAuth will be disabled.'
    );
  }

  // Check if Facebook OAuth environment variables are available
  if (
    process.env['FACEBOOK_CLIENT_ID'] &&
    process.env['FACEBOOK_CLIENT_SECRET'] &&
    process.env['FACEBOOK_CALLBACK_URL']
  ) {
    // Facebook OAuth Strategy Configuration
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env['FACEBOOK_CLIENT_ID']!,
          clientSecret: process.env['FACEBOOK_CLIENT_SECRET']!,
          callbackURL: process.env['FACEBOOK_CALLBACK_URL']!,
          profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
          scope: [...OAuthConfig.FACEBOOK_SCOPES],
        },
        async (
          accessToken: string,
          refreshToken: string | undefined,
          profile: any,
          done: any
        ) => {
          try {
            // Extract user information from Facebook profile
            const userProfile = {
              provider: OAUTH_PROVIDERS.FACEBOOK,
              providerId: profile.id,
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              displayName: profile.displayName,
              picture: profile.photos?.[0]?.value,
              phoneNumber: profile.phoneNumbers?.[0]?.value, // Facebook phone number if available
              accessToken,
              refreshToken,
              providerData: profile._json,
            };

            // Pass the profile data to be handled by your OAuth service
            return done(null, userProfile);
          } catch (error) {
            console.error('Facebook OAuth Strategy Error:', error);
            return done(error as Error, null);
          }
        }
      )
    );
  } else {
    console.warn(
      'Facebook OAuth environment variables not found. Facebook OAuth will be disabled.'
    );
  }
};

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Initialize Passport middleware
export const initializePassport = () => {
  // Initialize Passport strategies
  initializePassportStrategies();
  return passport.initialize();
};

// Session middleware (if using sessions)
export const passportSession = () => {
  return passport.session();
};

// Export passport instance for use in routes
export default passport;

// Type definitions for OAuth user profile
export interface OAuthUserProfile {
  provider: string;
  providerId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  picture?: string;
  phoneNumber?: string; // Phone number from OAuth provider (if available)
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  providerData: any;
}

// Helper function to get strategy by provider
export const getStrategyByProvider = (provider: string) => {
  switch (provider) {
    case OAUTH_PROVIDERS.GOOGLE:
      return 'google';
    case OAUTH_PROVIDERS.FACEBOOK:
      return 'facebook';
    case OAUTH_PROVIDERS.APPLE:
      return 'apple';
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

// Helper function to get scopes by provider
export const getScopesByProvider = (provider: string) => {
  switch (provider) {
    case OAUTH_PROVIDERS.GOOGLE:
      return OAuthConfig.GOOGLE_SCOPES;
    case OAUTH_PROVIDERS.FACEBOOK:
      return OAuthConfig.FACEBOOK_SCOPES;
    case OAUTH_PROVIDERS.APPLE:
      return OAuthConfig.APPLE_SCOPES;
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};
