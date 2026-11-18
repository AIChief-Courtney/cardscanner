# Scratch

Account starter project with sign-up, sign-in, a user dashboard, and a role-protected admin dashboard. Built with **Next.js**, **PostgreSQL**, and **Prisma**.

## Local setup

Prerequisites: Node.js 22+, npm, and Docker (or PostgreSQL 17+).

```sh
npm install
node backend/scripts/setup-local.cjs
docker compose -f backend/compose.yaml -p cardscanner up -d db
npm run db:generate
npm run db:migrate
npm run dev
```

If the browser shows **Internal Server Error**, stop all dev servers and run:

```sh
npm run dev:fresh
```

That clears a stale `frontend/.next` cache and frees port 3000.

Open http://localhost:3000, then create an account at `/signup`. To grant an account administrator access, run `npm run admin -- your-email@example.com`; the admin console is at `/admin/overview` (Users and Activity are in the sidebar).

After pulling new backend changes, run `npm run db:migrate` and `npm run db:check`.

Set `NEXT_PUBLIC_SITE_URL` to the deployed site origin to add the sitemap reference to `robots.txt`.
