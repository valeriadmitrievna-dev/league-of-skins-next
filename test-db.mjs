import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres.rzwcacnaunsooiuyscie:bxqVdjkTsgdLfH26@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
})

await client.connect()
console.log('connected!')
await client.end()