/**
 * Fetches pooler + direct Postgres URLs from the Supabase Management API
 * and updates the repo root `.env`, then runs migrations.
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN  — https://supabase.com/dashboard/account/tokens
 *   SUPABASE_DB_PASSWORD   — database password from project creation / reset
 * Optional:
 *   SUPABASE_PROJECT_REF   — defaults to first project (prefers name "cardscanner")
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const api = "https://api.supabase.com/v1";

type Project = { id: string; name: string; organization_id: string; region: string; status: string };

type PoolerRow = {
  connection_string?: string;
  connectionString?: string;
  pool_mode?: string;
  db_host?: string;
  db_port?: number;
};

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

function encodePassword(password: string): string {
  return encodeURIComponent(password);
}

function withPassword(uri: string, password: string): string {
  const encoded = encodePassword(password);
  if (uri.includes("[YOUR-PASSWORD]")) return uri.replace("[YOUR-PASSWORD]", encoded);
  return uri.replace(/:(?:[^:@/]+)@/, `:${encoded}@`);
}

function parseEnvValue(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('"') && t.endsWith('"')) {
    try {
      return JSON.parse(t) as string;
    } catch {
      return t.slice(1, -1);
    }
  }
  return t;
}

function quoteEnvValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function upsertEnv(lines: Record<string, string>) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const envPath = path.join(root, ".env");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const map = new Map<string, string>();

  for (const line of existing.split(/\r?\n/)) {
    const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line.trim());
    if (m) map.set(m[1], parseEnvValue(m[2]));
  }
  for (const [k, v] of Object.entries(lines)) map.set(k, v);

  const defaults: Record<string, string> = {
    AUTH_URL: "http://localhost:3000",
    AUTH_TRUST_HOST: "true",
  };
  for (const [k, v] of Object.entries(defaults)) {
    if (!map.has(k)) map.set(k, v);
  }

  if (!map.has("AUTH_SECRET") || map.get("AUTH_SECRET")!.length < 32) {
    fail("AUTH_SECRET missing or too short in .env — run setup-local or set a 32+ char secret.");
  }

  const order = ["DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "AUTH_URL", "AUTH_TRUST_HOST"];
  const written = new Set<string>();
  const out: string[] = [];
  for (const key of order) {
    if (map.has(key)) {
      out.push(`${key}=${quoteEnvValue(map.get(key)!)}`);
      written.add(key);
    }
  }
  for (const [key, val] of map) {
    if (!written.has(key)) out.push(`${key}=${quoteEnvValue(val)}`);
  }
  fs.writeFileSync(envPath, `${out.join("\n")}\n`);
  console.info(`Updated ${envPath}`);
}

async function mgmt<T>(token: string, route: string): Promise<T> {
  const res = await fetch(`${api}${route}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    fail(`Management API ${route} failed (${res.status}): ${body.slice(0, 500)}`);
  }
  return res.json() as Promise<T>;
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!token) {
    fail(
      "Set SUPABASE_ACCESS_TOKEN (Personal Access Token from supabase.com/dashboard/account/tokens).",
    );
  }
  if (!dbPassword) {
    fail("Set SUPABASE_DB_PASSWORD (Project Settings → Database password).");
  }

  const projects = await mgmt<Project[]>(token, "/projects");
  if (!projects.length) fail("No Supabase projects on this account.");

  const refFilter = process.env.SUPABASE_PROJECT_REF?.trim();
  let project =
    (refFilter && projects.find((p) => p.id === refFilter)) ||
    projects.find((p) => p.name.toLowerCase() === "cardscanner") ||
    projects[0];

  const ref = project.id;
  console.info(`Using project "${project.name}" (${ref})`);

  await mgmt<{ database?: { host?: string } }>(token, `/projects/${ref}`);

  const pooler = await mgmt<PoolerRow[]>(token, `/projects/${ref}/config/database/pooler`);
  const txn =
    pooler.find((p) => p.pool_mode === "transaction") ??
    pooler.find((p) => (p.db_port ?? 0) === 6543) ??
    pooler[0];
  const session =
    pooler.find((p) => p.pool_mode === "session") ??
    pooler.find((p) => (p.db_port ?? 0) === 5432 && p.pool_mode !== "transaction");

  let databaseUrl = txn?.connection_string ?? txn?.connectionString;
  if (!databaseUrl) {
    databaseUrl = `postgresql://postgres.${ref}:${encodePassword(dbPassword)}@aws-0-${project.region}.pooler.supabase.com:6543/postgres`;
  } else {
    databaseUrl = withPassword(databaseUrl, dbPassword);
    try {
      const u = new URL(databaseUrl.replace(/^postgresql:/, "postgres:"));
      if (u.password) u.password = encodePassword(dbPassword);
      databaseUrl = u.toString().replace(/^postgres:/, "postgresql:");
    } catch {
      /* keep withPassword result */
    }
  }
  if (!databaseUrl.includes("pgbouncer=true")) {
    databaseUrl += databaseUrl.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true";
  }
  if (!databaseUrl.includes("sslmode=")) {
    databaseUrl += "&sslmode=require";
  }

  let directUrl =
    session?.connection_string ?? session?.connectionString
      ? withPassword(session.connection_string ?? session.connectionString!, dbPassword)
      : `postgresql://postgres.${ref}:${encodePassword(dbPassword)}@${txn?.db_host ?? `aws-0-${project.region}.pooler.supabase.com`}:5432/postgres`;
  if (!directUrl.includes("sslmode=")) {
    directUrl += directUrl.includes("?") ? "&sslmode=require" : "?sslmode=require";
  }

  upsertEnv({ DATABASE_URL: databaseUrl, DIRECT_URL: directUrl });

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const envFile = path.join(root, ".env");
  const prisma = path.join(root, "node_modules/prisma/build/index.js");

  const env = { ...process.env };
  const fresh = fs.readFileSync(envFile, "utf8");
  for (const line of fresh.split(/\r?\n/)) {
    const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line.trim());
    if (m) env[m[1]] = parseEnvValue(m[2]);
  }

  console.info("Running prisma generate…");
  let r = spawnSync("node", [prisma, "generate"], {
    cwd: path.join(root, "backend"),
    env,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);

  console.info("Running prisma migrate deploy…");
  r = spawnSync("node", [prisma, "migrate", "deploy"], {
    cwd: path.join(root, "backend"),
    env,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);

  console.info("Running db:check…");
  r = spawnSync("node", ["--import", "tsx", "scripts/db-check.ts"], {
    cwd: path.join(root, "backend"),
    env,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);

  console.info("Supabase connected and migrations applied.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});