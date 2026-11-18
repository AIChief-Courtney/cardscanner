import { db } from "../src/lib/db";

async function main() {
  await db.$queryRaw`SELECT 1`;
  await db.activity.count();
  await db.user.findFirst({ select: { requestCount: true, balanceUsd: true } });
  console.log("Database OK: connected (User + Activity schema)");
  await db.$disconnect();
}

main().catch((err) => {
  console.error("Database check failed:", err instanceof Error ? err.message : err);
  console.error("Run: npm run db:migrate");
  process.exit(1);
});