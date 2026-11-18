/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const fs = require("node:fs");
const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) process.loadEnvFile(envPath);