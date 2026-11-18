import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { errorResponse } from "@backend/lib/http";
import { usdFromDb } from "@backend/lib/money";
import { ROLE_ADMIN } from "@backend/lib/roles";

export async function GET() {
  try {
    await requireUser(true);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      adminUsers,
      totalActivities,
      requestTotals,
      balanceTotals,
      signupsLast7Days,
      recent,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: ROLE_ADMIN } }),
      db.activity.count(),
      db.user.aggregate({ _sum: { requestCount: true } }),
      db.user.aggregate({ _sum: { balanceUsd: true } }),
      db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
    ]);

    const byAction = await db.activity.groupBy({
      by: ["action"],
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
      take: 8,
    });

    return NextResponse.json(
      {
        totalUsers,
        adminUsers,
        memberUsers: totalUsers - adminUsers,
        totalActivities,
        totalRequests: requestTotals._sum.requestCount ?? 0,
        totalBalanceUsd: usdFromDb(balanceTotals._sum.balanceUsd ?? new Prisma.Decimal(0)),
        signupsLast7Days,
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
      },
      { headers: { "Cache-Control": "no-store, must-revalidate" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}