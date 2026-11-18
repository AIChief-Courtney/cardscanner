import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { ApiError, errorResponse, jsonBody, sameOrigin } from "@backend/lib/http";
import { parseUsdAmount, usdFromDb } from "@backend/lib/money";
import { logActivity } from "@backend/lib/activity";
import { ROLE_ADMIN, ROLE_USER, normalizeRole } from "@backend/lib/roles";

const updateSchema = z
  .object({
    id: z.string().min(1).max(64),
    email: z.string().email().max(254).optional(),
    role: z.union([z.literal(0), z.literal(1), z.literal(ROLE_USER), z.literal(ROLE_ADMIN)]).optional(),
    balanceUsd: z.number().optional(),
  })
  .refine((data) => data.email !== undefined || data.role !== undefined || data.balanceUsd !== undefined, {
    message: "Provide email, role, or balance to update.",
  });

export async function PATCH(req: Request) {
  try {
    sameOrigin(req);
    const actor = await requireUser(true);
    const parsed = updateSchema.safeParse(await jsonBody(req));
    if (!parsed.success)
      throw new ApiError("INVALID_INPUT", "Provide a valid user id and email and/or role (0 or 1).");

    const { id, email, role, balanceUsd } = parsed.data;
    const data: { email?: string; role?: number; balanceUsd?: ReturnType<typeof parseUsdAmount> } = {};
    if (email !== undefined) data.email = email.toLowerCase();
    if (role !== undefined) data.role = normalizeRole(role);
    if (balanceUsd !== undefined) data.balanceUsd = parseUsdAmount(balanceUsd);

    const updated = await db.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, balanceUsd: true, createdAt: true },
    });

    await logActivity({
      userId: actor.id,
      action: "admin_user_update",
      summary: `Admin updated ${updated.email}`,
      meta: { targetUserId: id, fields: Object.keys(data) },
      incrementRequestCount: false,
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        role: normalizeRole(updated.role),
        balanceUsd: usdFromDb(updated.balanceUsd),
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return errorResponse(new ApiError("NOT_FOUND", "User not found.", 404));
      if (error.code === "P2002")
        return errorResponse(
          new ApiError("ACCOUNT_UNAVAILABLE", "That email is already in use.", 409),
        );
    }
    return errorResponse(error);
  }
}