import { Prisma } from "@prisma/client";
import { activityDailyCounts, userSignupDailyCounts } from "@backend/lib/daily-counts";
import { db } from "@backend/lib/db";
import { usdFromDb } from "@backend/lib/money";
import { ROLE_ADMIN } from "@backend/lib/roles";

export const OVERVIEW_TREND_DAYS = 14;

export type OverviewRange = "today" | "week" | "month";

export function overviewTrendDays(range: OverviewRange): number {
  switch (range) {
    case "today":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    default:
      return 7;
  }
}

export function parseOverviewRange(raw: string | null | undefined): OverviewRange {
  if (raw === "today" || raw === "week" || raw === "month") return raw;
  return "week";
}

export async function getAdminOverviewData(range: OverviewRange = "week") {
  const trendDays = overviewTrendDays(range);
  const periodStart = new Date();
  periodStart.setUTCHours(0, 0, 0, 0);
  if (trendDays > 1) {
    periodStart.setUTCDate(periodStart.getUTCDate() - (trendDays - 1));
  }
  const [
    totalUsers,
    adminUsers,
    totalActivities,
    requestTotals,
    balanceTotals,
    signupsInPeriod,
    recent,
    byAction,
    activityByDay,
    signupsByDay,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: ROLE_ADMIN } }),
    db.activity.count(),
    db.user.aggregate({ _sum: { requestCount: true } }),
    db.user.aggregate({ _sum: { balanceUsd: true } }),
    db.user.count({ where: { createdAt: { gte: periodStart } } }),
    db.activity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    }),
    db.activity.groupBy({
      by: ["action"],
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
      take: 8,
    }),
    activityDailyCounts(trendDays),
    userSignupDailyCounts(trendDays),
  ]);

  return {
    range,
    totalUsers,
    adminUsers,
    memberUsers: totalUsers - adminUsers,
    totalActivities,
    totalRequests: requestTotals._sum.requestCount ?? 0,
    totalBalanceUsd: usdFromDb(balanceTotals._sum.balanceUsd ?? new Prisma.Decimal(0)),
    signupsInPeriod,
    activityByDay,
    signupsByDay,
    trendDays,
    recentActivities: recent.map((row) => ({
      id: row.id,
      action: row.action,
      summary: row.summary,
      email: row.user?.email ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
    activityByAction: byAction.map((row) => ({
      action: row.action,
      count: row._count._all,
    })),
  };
}

export type AdminOverviewData = Awaited<ReturnType<typeof getAdminOverviewData>>;