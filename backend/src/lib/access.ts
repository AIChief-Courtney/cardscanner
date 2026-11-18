import { auth } from "@backend/auth";

import { db } from "./db";

import { ApiError } from "./http";

import { usdFromDb } from "./money";
import { isAdmin, normalizeRole } from "./roles";



export async function currentUser() {

  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({

    where: { id: session.user.id },

    select: { id: true, email: true, role: true, balanceUsd: true, createdAt: true },

  });

  if (!user) return null;

  return {
    ...user,
    role: normalizeRole(user.role),
    balanceUsd: usdFromDb(user.balanceUsd),
    createdAt: user.createdAt.toISOString(),
  };

}



export async function requireUser(admin = false) {

  const user = await currentUser();

  if (!user) throw new ApiError("UNAUTHORIZED", "Please sign in to continue.", 401);

  if (admin && !isAdmin(user.role))

    throw new ApiError("FORBIDDEN", "Administrator access is required.", 403);

  return user;

}
