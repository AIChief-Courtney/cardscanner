import { NextResponse } from "next/server";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { errorResponse } from "@backend/lib/http";
import { usdFromDb } from "@backend/lib/money";
import { ROLE_ADMIN, normalizeRole } from "@backend/lib/roles";

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

    const [totalUsers, adminUsers, users] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: ROLE_ADMIN } }),
      db.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          balanceUsd: true,
          requestCount: true,
          createdAt: true,
        },
        orderBy: [{ role: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json(
      {
        totalUsers,
        adminUsers,
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          role: normalizeRole(u.role),
          balanceUsd: usdFromDb(u.balanceUsd),
          requestCount: u.requestCount,
          createdAt: u.createdAt.toISOString(),
        })),
        page,
        pageSize,
      },
      { headers: { "Cache-Control": "no-store, must-revalidate" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}