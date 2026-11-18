/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const nextDir = path.resolve(__dirname, "../../frontend/.next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed frontend/.next");
}

if (process.platform === "win32") {
  try {
    const out = execSync('netstat -ano | findstr ":3000" | findstr "LISTENING"', {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const line = out.trim().split("\n")[0] ?? "";
    const pid = line.trim().split(/\s+/).pop();
    if (pid && pid !== "0" && /^\d+$/.test(pid)) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`Stopped process on port 3000 (PID ${pid})`);
    }
  } catch {
    /* port free */
  }
}

console.log("Ready: npm run dev");