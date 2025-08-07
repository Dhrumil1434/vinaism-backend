import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { validateEnv } from '@utils-core';
import { db, poolConnection } from './db/mysql.db';

// Validate required environment variables
validateEnv([
  'PORT',
  'MONGO_URI',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'NODE_ENV',
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FACEBOOK_CLIENT_ID',
  'FACEBOOK_CLIENT_SECRET',
  'FACEBOOK_CALLBACK_URL',
  'APPLE_CLIENT_ID',
  'APPLE_TEAM_ID',
  'APPLE_KEY_ID',
  'APPLE_PRIVATE_KEY',
  'APPLE_CALLBACK_URL',
]);

const PORT = process.env['PORT'] || 3000;

/**
 * Initializes the MySQL connection and starts the Express server.
 */
async function bootstrap() {
  try {
    // Test MySQL connection
    const conn = await poolConnection.getConnection();
    await conn.ping();
    console.log('✅ MySQL connection established.');
    conn.release();

    // Attach db and pool to app locals (optional, for downstream access)
    // Attach db and pool to app locals (optional, for downstream access)
    app.locals['db'] = db;
    app.locals['pool'] = poolConnection;

    // Start server
    app.listen(PORT, () => {
      console.log(`⚙️ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error);
    process.exit(1);
  }
}

bootstrap();
