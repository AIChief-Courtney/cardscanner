import { Prisma } from "@prisma/client";
import { ApiError } from "./http";

export function usdFromDb(value: Prisma.Decimal): string {
  return value.toFixed(2);
}

export function parseUsdAmount(raw: unknown): Prisma.Decimal {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    throw new ApiError("INVALID_INPUT", "Balance must be a valid USD amount.");
  }
  if (raw < 0 || raw > 999_999_999.99) {
    throw new ApiError("INVALID_INPUT", "Balance must be between 0 and 999,999,999.99 USD.");
  }
  return new Prisma.Decimal(raw.toFixed(2));
}