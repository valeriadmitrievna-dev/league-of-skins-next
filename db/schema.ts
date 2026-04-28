import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin'])

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  ownedSkins: text('owned_skins').array().notNull().default([]),
  ownedChromas: text('owned_chromas').array().notNull().default([]),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
})

export const wishlists = pgTable('wishlists', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  skins: text('skins').array().notNull().default([]),
  chromas: text('chromas').array().notNull().default([]),
  link: text('link').notNull().unique(),
  views: integer('views').notNull().default(0),
  subscribers: integer('subscribers').notNull().default(0),
  private: boolean('private').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
})

export const userSubscriptions = pgTable('user_subscriptions', {
  userId: text('user_id').notNull().references(() => users.id),
  wishlistId: text('wishlist_id').notNull().references(() => wishlists.id),
})

export const refreshTokens = pgTable('refresh_tokens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})