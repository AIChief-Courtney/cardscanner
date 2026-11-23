import { Prisma } from "@prisma/client";
import { activityDailyCounts } from "@backend/lib/daily-counts";
import { OVERVIEW_TREND_DAYS } from "@backend/lib/admin-overview-data";
import { db } from "@backend/lib/db";
import { usdFromDb } from "@backend/lib/money";
import { normalizeRole } from "@backend/lib/roles";

export const ACTIVITY_PAGE_SIZES = [10, 20, 50, 100] as const;

export function parseActivityPageSize(raw: number | string | null | undefined): number {
  const n = Number(raw);
  if (ACTIVITY_PAGE_SIZES.includes(n as (typeof ACTIVITY_PAGE_SIZES)[number])) return n;
  return 20;
}

export async function getAdminActivityStats(actionFilter?: string) {
  const where = actionFilter ? { action: actionFilter } : {};

  const [total, totalActivities, requestTotals, balanceTotals, actionTypes, activityByDay] =
    await Promise.all([
      db.activity.count({ where }),
      db.activity.count(),
      db.user.aggregate({ _sum: { requestCount: true } }),
      db.user.aggregate({ _sum: { balanceUsd: true } }),
      db.activity.groupBy({
        by: ["action"],
        _count: { _all: true },
        orderBy: { _count: { action: "desc" } },
      }),
      activityDailyCounts(OVERVIEW_TREND_DAYS),
    ]);

  return {
    total,
    totalActivities,
    totalRequests: requestTotals._sum.requestCount ?? 0,
    totalBalanceUsd: usdFromDb(balanceTotals._sum.balanceUsd ?? new Prisma.Decimal(0)),
    activityByDay,
    trendDays: OVERVIEW_TREND_DAYS,
    actionTypes: actionTypes.map((a) => ({ action: a.action, count: a._count._all })),
  };
}

export async function getAdminActivityList(options: {
  page: number;
  pageSize: number;
  actionFilter?: string;
}) {
  const { page, pageSize, actionFilter } = options;
  const where = actionFilter ? { action: actionFilter } : {};

  const [total, rows] = await Promise.all([
    db.activity.count({ where }),
    db.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            balanceUsd: true,
            requestCount: true,
          },
        },
      },
    }),
  ]);

  return {
    page,
    pageSize,
    total,
    activities: rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      action: row.action,
      summary: row.summary,
      amountUsd: row.amountUsd != null ? usdFromDb(row.amountUsd) : null,
      balanceAfterUsd: row.balanceAfterUsd != null ? usdFromDb(row.balanceAfterUsd) : null,
      createdAt: row.createdAt.toISOString(),
      user: row.user
        ? {
            id: row.user.id,
            email: row.user.email,
            role: normalizeRole(row.user.role),
            balanceUsd: usdFromDb(row.user.balanceUsd),
            requestCount: row.user.requestCount,
          }
        : null,
    })),
  };
}

export async function getAdminActivityData(options: {
  page: number;
  pageSize: number;
  actionFilter?: string;
}) {
  const [stats, list] = await Promise.all([
    getAdminActivityStats(options.actionFilter),
    getAdminActivityList(options),
  ]);
  return { ...stats, ...list };
}

export type AdminActivityData = Awaited<ReturnType<typeof getAdminActivityData>>;