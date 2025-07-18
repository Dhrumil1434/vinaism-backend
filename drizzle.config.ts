import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/db/index.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
