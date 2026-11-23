import type { ActivityKind, Prisma } from "@prisma/client";
import { USER_ACTIVITY_KINDS } from "./activity-kinds";
import { db } from "./db";
import { usdFromDb } from "./money";

export { USER_ACTIVITY_KINDS };

export function serializeActivity(row: {
  id: string;
  kind: ActivityKind;
  action: string;
  summary: string;
  amountUsd: Prisma.Decimal | null;
  balanceAfterUsd: Prisma.Decimal | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    kind: row.kind,
    action: row.action,
    summary: row.summary,
    amountUsd: row.amountUsd != null ? usdFromDb(row.amountUsd) : null,
    balanceAfterUsd: row.balanceAfterUsd != null ? usdFromDb(row.balanceAfterUsd) : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listUserActivity(userId: string, page: number, pageSize: number) {
  const where = {
    userId,
    kind: { in: [...USER_ACTIVITY_KINDS] },
  };
  const [total, rows] = await Promise.all([
    db.activity.count({ where }),
    db.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return {
    page,
    pageSize,
    total,
    activities: rows.map(serializeActivity),
  };
}