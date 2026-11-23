import type { ActivityKind, Prisma } from "@prisma/client";
import { Prisma as PrismaNS } from "@prisma/client";
import { KIND_AUTH, KIND_SYSTEM, KIND_TRANSACTION } from "./activity-kinds";
import { db } from "./db";
import { usdFromDb } from "./money";

export const AUTH_ACTIONS = ["sign_in", "sign_up", "sign_out"] as const;
export type AuthAction = (typeof AUTH_ACTIONS)[number];
export const BALANCE_ACTION = "balance_change";

export type LogActivityInput = {
  userId: string;
  kind: ActivityKind;
  action: string;
  summary: string;
  amountUsd?: PrismaNS.Decimal;
  balanceAfterUsd?: PrismaNS.Decimal;
  meta?: Prisma.InputJsonValue;
  incrementRequestCount?: boolean;
};

async function writeActivity(input: LogActivityInput) {
  await db.activity.create({
    data: {
      userId: input.userId,
      kind: input.kind,
      action: input.action,
      summary: input.summary,
      amountUsd: input.amountUsd,
      balanceAfterUsd: input.balanceAfterUsd,
      meta: input.meta ?? undefined,
    },
  });

  if (input.incrementRequestCount !== false) {
    await db.user.update({
      where: { id: input.userId },
      data: { requestCount: { increment: 1 } },
    });
  }
}

export async function logAuthActivity(
  userId: string,
  action: AuthAction,
  summary: string,
  meta?: Prisma.InputJsonValue,
) {
  await writeActivity({
    userId,
    kind: KIND_AUTH,
    action,
    summary,
    meta,
    incrementRequestCount: action === "sign_in",
  });
}

export async function logBalanceChange(
  userId: string,
  previousUsd: PrismaNS.Decimal,
  nextUsd: PrismaNS.Decimal,
  meta?: Prisma.InputJsonValue,
) {
  const delta = nextUsd.minus(previousUsd);
  if (delta.isZero()) return;

  const sign = delta.greaterThan(0) ? "+" : "";
  await writeActivity({
    userId,
    kind: KIND_TRANSACTION,
    action: BALANCE_ACTION,
    summary: `Balance ${sign}${usdFromDb(delta)} USD (now ${usdFromDb(nextUsd)})`,
    amountUsd: delta,
    balanceAfterUsd: nextUsd,
    meta,
  });
}

export async function logSystemActivity(
  userId: string,
  action: string,
  summary: string,
  meta?: Prisma.InputJsonValue,
) {
  await writeActivity({
    userId,
    kind: KIND_SYSTEM,
    action,
    summary,
    meta,
    incrementRequestCount: false,
  });
}

/** @deprecated Prefer logAuthActivity / logBalanceChange / logSystemActivity */
export async function logActivity(input: {
  userId?: string | null;
  action: string;
  summary: string;
  meta?: Prisma.InputJsonValue;
  incrementRequestCount?: boolean;
}) {
  if (!input.userId) return;
  const kind =
    (AUTH_ACTIONS as readonly string[]).includes(input.action)
      ? KIND_AUTH
      : KIND_SYSTEM;
  await writeActivity({
    userId: input.userId,
    kind,
    action: input.action,
    summary: input.summary,
    meta: input.meta,
    incrementRequestCount: input.incrementRequestCount,
  });
}