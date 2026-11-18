/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const crypto = require("node:crypto");

if (!fs.existsSync(".env") || process.argv.includes("--repair")) {
  fs.writeFileSync(
    ".env",
    `DATABASE_URL="postgresql://cardscanner:cardscanner@localhost:5435/cardscanner?schema=public"\nDIRECT_URL="postgresql://cardscanner:cardscanner@localhost:5435/cardscanner?schema=public"\nAUTH_SECRET="${crypto.randomBytes(48).toString("hex")}"\nAUTH_URL="http://localhost:3000"\nAUTH_TRUST_HOST="true"\n`,
  );
  console.info("Created .env with local database URL and AUTH_SECRET.");
} else {
  console.info(".env already exists; left unchanged.");
}