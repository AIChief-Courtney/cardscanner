import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { errorResponse } from "@backend/lib/http";
import { usdFromDb } from "@backend/lib/money";
import { normalizeRole } from "@backend/lib/roles";

const PAGE_SIZES = [10, 20, 50, 100] as const;

function parsePageSize(raw: string | null): number {
  const n = Number(raw);
  if (PAGE_SIZES.includes(n as (typeof PAGE_SIZES)[number])) return n;
  return 20;
}

export async function GET(req: Request) {
  try {
    await requireUser(true);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Math.min(100000, Number(searchParams.get("page")) || 1));
    const pageSize = parsePageSize(searchParams.get("pageSize"));
    const actionFilter = searchParams.get("action")?.trim() || undefined;

    const where = actionFilter ? { action: actionFilter } : {};

    const [total, totalActivities, requestTotals, balanceTotals, rows] = await Promise.all([
      db.activity.count({ where }),
      db.activity.count(),
      db.user.aggregate({ _sum: { requestCount: true } }),
      db.user.aggregate({ _sum: { balanceUsd: true } }),
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

    const actionTypes = await db.activity.groupBy({
      by: ["action"],
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
    });

    return NextResponse.json(
      {
        page,
        pageSize,
        total,
        totalActivities,
        totalRequests: requestTotals._sum.requestCount ?? 0,
        totalBalanceUsd: usdFromDb(balanceTotals._sum.balanceUsd ?? new Prisma.Decimal(0)),
        actionTypes: actionTypes.map((a) => ({ action: a.action, count: a._count._all })),
        activities: rows.map((row) => ({
          id: row.id,
          action: row.action,
          summary: row.summary,
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
      },
      { headers: { "Cache-Control": "no-store, must-revalidate" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}