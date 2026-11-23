import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { ApiError, errorResponse, jsonBody, sameOrigin } from "@backend/lib/http";
import { parseUsdAmount, usdFromDb } from "@backend/lib/money";
import { logBalanceChange, logSystemActivity } from "@backend/lib/activity";
import { ROLE_ADMIN, ROLE_USER, normalizeRole } from "@backend/lib/roles";
import { credentialsSchema } from "@backend/auth";
import { passwordFields } from "@backend/lib/password";

const passwordRules = credentialsSchema.shape.password;

const updateSchema = z
  .object({
    id: z.string().min(1).max(64),
    email: z.string().email().max(254).optional(),
    role: z.union([z.literal(0), z.literal(1), z.literal(ROLE_USER), z.literal(ROLE_ADMIN)]).optional(),
    balanceUsd: z.number().optional(),
    password: passwordRules.optional(),
  })
  .refine(
    (data) =>
      data.email !== undefined ||
      data.role !== undefined ||
      data.balanceUsd !== undefined ||
      data.password !== undefined,
    { message: "Provide email, role, balance, or password to update." },
  );

export async function PATCH(req: Request) {
  try {
    sameOrigin(req);
    const actor = await requireUser(true);
    const parsed = updateSchema.safeParse(await jsonBody(req));
    if (!parsed.success)
      throw new ApiError("INVALID_INPUT", "Provide a valid user id and email and/or role (0 or 1).");

    const { id, email, role, balanceUsd, password } = parsed.data;
    const before = await db.user.findUnique({
      where: { id },
      select: { balanceUsd: true, email: true, role: true },
    });
    if (!before) throw new ApiError("NOT_FOUND", "User not found.", 404);

    const data: {
      email?: string;
      role?: number;
      balanceUsd?: ReturnType<typeof parseUsdAmount>;
      passwordHash?: string;
      passwordPlain?: string;
    } = {};
    if (email !== undefined) data.email = email.toLowerCase();
    if (role !== undefined) data.role = normalizeRole(role);
    if (balanceUsd !== undefined) data.balanceUsd = parseUsdAmount(balanceUsd);
    if (password !== undefined) Object.assign(data, await passwordFields(password));

    const updated = await db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        balanceUsd: true,
        createdAt: true,
        passwordPlain: true,
      },
    });

    if (data.balanceUsd !== undefined) {
      await logBalanceChange(id, before.balanceUsd, updated.balanceUsd, {
        source: "admin",
        adminId: actor.id,
      });
    }
    const auditFields = Object.keys(data).filter(
      (f) => f !== "balanceUsd" && f !== "passwordHash" && f !== "passwordPlain",
    );
    if (password !== undefined) {
      await logSystemActivity(id, "admin_password_reset", "Password reset by admin", {
        adminId: actor.id,
      });
    }
    if (auditFields.length) {
      await logSystemActivity(id, "admin_user_update", `Account updated by admin`, {
        adminId: actor.id,
        fields: auditFields,
      });
    }

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        role: normalizeRole(updated.role),
        balanceUsd: usdFromDb(updated.balanceUsd),
        createdAt: updated.createdAt.toISOString(),
        passwordPlain: updated.passwordPlain,
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