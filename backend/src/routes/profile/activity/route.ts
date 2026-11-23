import { NextResponse } from "next/server";
import { requireUser } from "@backend/lib/access";
import { errorResponse } from "@backend/lib/http";
import { listUserActivity } from "@backend/lib/user-activity";

export async function GET(req: Request) {
  try {
    const user = await requireUser(false);
    const url = new URL(req.url);
    const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
    const pageSize = Math.max(5, Math.min(50, Number(url.searchParams.get("pageSize")) || 20));
    const data = await listUserActivity(user.id, page, pageSize);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}