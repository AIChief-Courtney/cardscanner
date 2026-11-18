import { db } from "../src/lib/db.js";

async function main() {
  const row = await db.$queryRaw<[{ ok: number }]>`SELECT 1 AS ok`;
  console.log("Database OK:", row[0]?.ok === 1 ? "connected" : row);
  await db.$disconnect();
}

main().catch((err) => {
  console.error("Database connection failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});