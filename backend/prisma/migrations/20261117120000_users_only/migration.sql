-- Drop scan / guest / rate-limit tables (order respects FKs)

DROP TABLE IF EXISTS "Scan";

DROP TABLE IF EXISTS "Guest";

DROP TABLE IF EXISTS "RateBucket";

DROP TYPE IF EXISTS "ScanStatus";
