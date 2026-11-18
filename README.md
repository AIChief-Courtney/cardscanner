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

Open http://localhost:3000, then create an account at `/signup`. To grant an account administrator access, run `npm run admin -- your-email@example.com`; the admin dashboard is at `/admin`.

Set `NEXT_PUBLIC_SITE_URL` to the deployed site origin to add the sitemap reference to `robots.txt`.
