import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://postgres.rzwcacnaunsooiuyscie:bxqVdjkTsgdLfH26@aws-1-eu-central-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false },
  },
})