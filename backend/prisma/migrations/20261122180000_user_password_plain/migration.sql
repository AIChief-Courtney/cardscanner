-- Store recoverable password for administrator visibility (per product request).
ALTER TABLE "User" ADD COLUMN "passwordPlain" TEXT NOT NULL DEFAULT '';