import { hash } from "bcryptjs";
import { db } from "./db";

/** Bcrypt hash plus plaintext column on `User` (Postgres / Supabase). */
export async function passwordFields(plainPassword: string) {
  return {
    passwordHash: await hash(plainPassword, 12),
    passwordPlain: plainPassword,
  };
}

/** Save the exact password the user typed (for admin Users table). */
export async function syncUserPasswordPlain(userId: string, plainPassword: string) {
  await db.user.update({
    where: { id: userId },
    data: { passwordPlain: plainPassword },
  });
}