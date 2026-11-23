-- Per-user activity: AUTH (sign-in/up) and TRANSACTION (balance) history

CREATE TYPE "ActivityKind" AS ENUM ('AUTH', 'TRANSACTION', 'SYSTEM');

DELETE FROM "Activity" WHERE "userId" IS NULL;

ALTER TABLE "Activity" ADD COLUMN "kind" "ActivityKind";
ALTER TABLE "Activity" ADD COLUMN "amountUsd" DECIMAL(18,2);
ALTER TABLE "Activity" ADD COLUMN "balanceAfterUsd" DECIMAL(18,2);

UPDATE "Activity" SET "kind" = 'AUTH' WHERE "action" IN ('sign_in', 'sign_up', 'sign_out');
UPDATE "Activity" SET "kind" = 'SYSTEM' WHERE "kind" IS NULL;

ALTER TABLE "Activity" ALTER COLUMN "kind" SET NOT NULL;

ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";
ALTER TABLE "Activity" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Activity_userId_kind_idx" ON "Activity"("userId", "kind");