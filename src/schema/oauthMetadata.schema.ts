import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { users } from './user.schema';
import { timestamps } from './helpers/column.helpers';

export const oauthMetadata = mysqlTable(
  'oauth_metadata',
  {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id')
      .references(() => users.userId)
      .notNull(),
    provider: varchar('provider', { length: 50 }).notNull(),
    providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
    providerEmail: varchar('provider_email', { length: 255 }),
    providerName: varchar('provider_name', { length: 255 }),
    providerPicture: text('provider_picture'),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    tokenExpiresAt: timestamp('token_expires_at'),
    ...timestamps,
  },
  (table) => ({
    uniqueProviderUser: uniqueIndex('oauth_provider_user_idx').on(
      table.provider,
      table.providerUserId
    ),
  })
);
