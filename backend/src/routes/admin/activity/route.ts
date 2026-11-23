import { NextResponse } from "next/server";
import { requireUser } from "@backend/lib/access";
import {
  getAdminActivityData,
  getAdminActivityList,
  parseActivityPageSize,
} from "@backend/lib/admin-activity-data";
import { errorResponse } from "@backend/lib/http";

export async function GET(req: Request) {
  try {
    await requireUser(true);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Math.min(100000, Number(searchParams.get("page")) || 1));
    const pageSize = parseActivityPageSize(searchParams.get("pageSize"));
    const actionFilter = searchParams.get("action")?.trim() || undefined;
    const listOnly = searchParams.get("listOnly") === "1";

    const payload = listOnly
      ? await getAdminActivityList({ page, pageSize, actionFilter })
      : await getAdminActivityData({ page, pageSize, actionFilter });

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=3, stale-while-revalidate=15" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}