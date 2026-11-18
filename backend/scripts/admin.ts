import { db } from "../src/lib/db";
import { ROLE_ADMIN } from "../src/lib/roles";

const email = process.argv[2]?.toLowerCase();
if (!email) {
  console.error("Usage: npm run admin -- email@example.com (register the account first)");
  process.exitCode = 1;
} else {
  try {
    await db.user.update({ where: { email }, data: { role: ROLE_ADMIN } });
    console.info("Admin role granted to the existing account.");
  } catch {
    console.error("Account not found or database unavailable. Register first, then retry.");
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}