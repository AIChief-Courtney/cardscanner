import type { Prisma } from "@prisma/client";
import { db } from "./db";

export type LogActivityInput = {
  userId?: string | null;
  action: string;
  summary: string;
  meta?: Prisma.InputJsonValue;
  incrementRequestCount?: boolean;
};

export async function logActivity({
  userId,
  action,
  summary,
  meta,
  incrementRequestCount = true,
}: LogActivityInput) {
  const tasks: Promise<unknown>[] = [
    db.activity.create({
      data: {
        userId: userId ?? undefined,
        action,
        summary,
        meta: meta ?? undefined,
      },
    }),
  ];

  if (userId && incrementRequestCount) {
    tasks.push(
      db.user.update({
        where: { id: userId },
        data: { requestCount: { increment: 1 } },
      }),
    );
  }

  await db.$transaction(tasks);
}