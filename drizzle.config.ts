import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/schema/',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
  verbose: true,
  strict: true,
});
