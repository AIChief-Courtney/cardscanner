# Supabase

Cardscanner uses Supabase **PostgreSQL** via Prisma. Auth remains NextAuth + app `User` rows for now.

## Environment

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | **Transaction pooler** (port `6543`, `?pgbouncer=true`) — runtime queries |
| `DIRECT_URL` | **Session pooler** or direct Postgres (port `5432`) — `prisma migrate deploy`. Use the pooler hostname if `db.<ref>.supabase.co` is unreachable on your network. |

From the Supabase dashboard: **Project Settings → Database → Connection string** (URI).

## One-command connect (recommended)

Supabase does **not** allow signing into the Management API with your dashboard email/password. Use a **Personal Access Token** once:

1. Open [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) → **Generate new token** (scoped to your project is fine; include **Database** / pooler read if scoped).
2. In PowerShell from the repo root (replace values; do **not** commit these):

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
$env:SUPABASE_DB_PASSWORD = "your-database-password"
# optional: $env:SUPABASE_PROJECT_REF = "abcdefghijklmnop"
npm run supabase:connect
```

This writes `DATABASE_URL` and `DIRECT_URL` to `.env`, runs migrations, and checks the connection.

## Manual commands

```bash
npm run db:generate
npm run db:migrate
npm run db:check
```

## Notes

- Migrations must use `DIRECT_URL`; the pooler does not support all migration operations.
- Keep `AUTH_SECRET` and database passwords out of git (`.env` is not committed).