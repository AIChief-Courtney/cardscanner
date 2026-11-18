# Architecture

## Layout

```text
frontend/src/app/
  page.tsx              Public home (tools, marketing)
  signin/, signup/      Auth pages
  dashboard/            Signed-in users
  admin/                role = 1 — layout + /overview, /users, /activity
  api/*/route.ts        Thin adapters → backend/src/routes/

backend/
  prisma/               PostgreSQL schema + migrations (Supabase in production)
  src/lib/              db, auth helpers, HTTP utilities
  src/routes/           API implementations
  src/auth.ts           Auth.js (credentials)
```

One Next.js process serves the app. The `backend` workspace is not a separate HTTP server; it is shared TypeScript imported from API routes and server components.

## Roles

| Route | Audience |
|-------|----------|
| `/` | Everyone |
| `/dashboard` | Signed-in users (`role` 0 or 1) |
| `/admin` | `role = 1` (admin) only |

Public registration always sets `role = 0` (user). Promote via `npm run admin -- email` (`role = 1`).
