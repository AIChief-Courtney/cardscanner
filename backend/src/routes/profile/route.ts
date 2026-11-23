import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { passwordFields } from "@backend/lib/password";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { credentialsSchema } from "@backend/auth";
import { requireUser } from "@backend/lib/access";
import { db } from "@backend/lib/db";
import { ApiError, errorResponse, jsonBody, sameOrigin } from "@backend/lib/http";
import { usdFromDb } from "@backend/lib/money";
import { logSystemActivity } from "@backend/lib/activity";
import { normalizeRole, roleLabel } from "@backend/lib/roles";

const passwordRules = credentialsSchema.shape.password;

const updateSchema = z
  .object({
    email: z.string().email().max(254).optional(),
    currentPassword: z.string().optional(),
    newPassword: passwordRules.optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const changingPassword = data.newPassword !== undefined && data.newPassword.length > 0;
    if (changingPassword) {
      if (!data.currentPassword || data.currentPassword.length < 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter your current password to set a new one.",
          path: ["currentPassword"],
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New passwords do not match.",
          path: ["confirmPassword"],
        });
      }
    }
  })
  .refine(
    (data) =>
      data.email !== undefined ||
      (data.newPassword !== undefined && data.newPassword.length > 0),
    { message: "Change email or password to save." },
  );

function serializeUser(row: {
  id: string;
  email: string;
  role: number;
  balanceUsd: Prisma.Decimal;
  createdAt: Date;
}) {
  return {
    id: row.id,
    email: row.email,
    role: normalizeRole(row.role),
    roleLabel: roleLabel(normalizeRole(row.role)),
    balanceUsd: usdFromDb(row.balanceUsd),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const actor = await requireUser(false);
    const row = await db.user.findUnique({
      where: { id: actor.id },
      select: { id: true, email: true, role: true, balanceUsd: true, createdAt: true },
    });
    if (!row) throw new ApiError("NOT_FOUND", "Account not found.", 404);
    return NextResponse.json({ user: serializeUser(row) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: Request) {
  try {
    sameOrigin(req);
    const actor = await requireUser(false);
    const body = await jsonBody(req);
    if (body && typeof body === "object" && "balanceUsd" in body) {
      throw new ApiError(
        "FORBIDDEN",
        "Balance cannot be edited here. It only changes when you top up.",
        403,
      );
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid profile data.";
      throw new ApiError("INVALID_INPUT", msg);
    }

    const { email, currentPassword, newPassword } = parsed.data;
    const data: { email?: string; passwordHash?: string; passwordPlain?: string } = {};

    if (email !== undefined) data.email = email.toLowerCase();

    if (newPassword) {
      const row = await db.user.findUnique({
        where: { id: actor.id },
        select: { passwordHash: true },
      });
      if (!row) throw new ApiError("NOT_FOUND", "Account not found.", 404);
      const valid = await compare(currentPassword ?? "", row.passwordHash);
      if (!valid)
        throw new ApiError("INVALID_INPUT", "Current password is incorrect.", 400);
      Object.assign(data, await passwordFields(newPassword));
    }

    const before = await db.user.findUnique({
      where: { id: actor.id },
      select: { balanceUsd: true, email: true },
    });
    if (!before) throw new ApiError("NOT_FOUND", "Account not found.", 404);

    const updated = await db.user.update({
      where: { id: actor.id },
      data,
      select: { id: true, email: true, role: true, balanceUsd: true, createdAt: true },
    });

    if (data.email !== undefined && data.email !== before.email) {
      await logSystemActivity(actor.id, "profile_email_update", `Email changed to ${updated.email}`, {
        previousEmail: before.email,
      });
    }
    if (data.passwordHash) {
      await logSystemActivity(actor.id, "profile_password_update", "Password changed", {});
    }

    return NextResponse.json({ user: serializeUser(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse(
        new ApiError("ACCOUNT_UNAVAILABLE", "That email is already in use.", 409),
      );
    }
    return errorResponse(error);
  }
}