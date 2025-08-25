import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { errorHandler } from './middlewares/errorHandler.middleware';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config';
import userTypeRouter from './routes/userType.routes';
import userRegistrationRouter from './routes/userRegistration.routes';
import otpRouter from './routes/otp.routes';
import adminRouter from './routes/admin.routes';
import loginRouter from './routes/login.routes';
import oauthRouter from './routes/oauth.routes';
import notificationRouter from './routes/notification.routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandler();
  }

  private setMiddlewares(): void {
    this.app.use(compression());
    this.app.use(
      rateLimit({
        windowMs: 10 * 60 * 1000, // 15 mins
        max: 30, // Limit each IP to 100 requests per windowMs
        message:
          'Too many requests from this IP, please try again after 15 minutes.',
      })
    );
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use('/uploads', express.static('public/uploads'));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: 'http://localhost:4200', // your Angular app's origin
        credentials: true, // <-- allow credentials
      })
    );
    this.app.use(morgan('dev'));
    this.app.use(cookieParser());

    // Configure session middleware with proper settings for OAuth
    this.app.use(
      session({
        secret:
          process.env['SESSION_SECRET'] ||
          'your-secret-key-change-in-production',
        resave: false,
        saveUninitialized: true, // Required for OAuth to store userTypeId before authentication
        cookie: {
          secure: false, // Set to false for localhost (HTTP)
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: 'lax', // Required for OAuth redirects
        },
        name: 'oauth.session', // Custom session name for better debugging
      })
    );

    // Initialize Passport with our configuration
    this.app.use(initializePassport());
    this.app.use(passport.session());
  }

  private setRoutes(): void {
    this.app.use('/api/userType', userTypeRouter);
    this.app.use('/api/userRegister', userRegistrationRouter);
    this.app.use('/api/otp', otpRouter);
    this.app.use('/api/admin', adminRouter);
    this.app.use('/api/userLogin', loginRouter);
    this.app.use('/api/auth', oauthRouter);
    this.app.use('/api/notifications', notificationRouter);

    // Add more routes here or import from separate files
  }

  private setErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}
export default new App().getServer();
