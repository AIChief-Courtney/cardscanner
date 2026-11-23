import type { ActivityKind } from "@prisma/client";

/** String literals avoid Next.js bundling issues with Prisma enum objects at module load. */
export const KIND_AUTH = "AUTH" satisfies ActivityKind;
export const KIND_TRANSACTION = "TRANSACTION" satisfies ActivityKind;
export const KIND_SYSTEM = "SYSTEM" satisfies ActivityKind;

export const USER_ACTIVITY_KINDS = [KIND_AUTH, KIND_TRANSACTION] as const;