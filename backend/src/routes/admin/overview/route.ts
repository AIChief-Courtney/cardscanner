import { NextResponse } from "next/server";
import { requireUser } from "@backend/lib/access";
import { getAdminOverviewData, parseOverviewRange } from "@backend/lib/admin-overview-data";
import { errorResponse } from "@backend/lib/http";

export async function GET(req: Request) {
  try {
    await requireUser(true);
    const range = parseOverviewRange(new URL(req.url).searchParams.get("range"));
    const payload = await getAdminOverviewData(range);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=3, stale-while-revalidate=15" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}