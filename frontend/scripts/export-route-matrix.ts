import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRouteMatrix } from "../src/lib/tools/registry";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const STATIC_ROUTES = [
  { referenceUrl: "https://www.freeconvert.com/", localUrl: "/", behavior: "Marketing + embedded image workspace", status: "verified", gaps: "No live cloud pickers on home" },
  { referenceUrl: "https://www.freeconvert.com/pricing", localUrl: "/pricing", behavior: "Plans (demo)", status: "demo", gaps: "No Stripe checkout" },
  { referenceUrl: "—", localUrl: "/convert", behavior: "Converter directory", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/compress", behavior: "Compressor directory", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/tools", behavior: "Utility directory", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/faq", behavior: "Help FAQ", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/contact", behavior: "Contact form (demo)", status: "demo", gaps: "No mail delivery" },
  { referenceUrl: "—", localUrl: "/privacy", behavior: "Privacy policy", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/terms", behavior: "Terms", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/security", behavior: "Security", status: "verified", gaps: "—" },
  { referenceUrl: "—", localUrl: "/signin", behavior: "NextAuth sign-in", status: "integrated", gaps: "—" },
  { referenceUrl: "—", localUrl: "/signup", behavior: "Registration", status: "integrated", gaps: "—" },
  { referenceUrl: "—", localUrl: "/account/*", behavior: "Account hub (demo billing)", status: "demo", gaps: "Login gated" },
  { referenceUrl: "—", localUrl: "/profile", behavior: "Profile", status: "integrated", gaps: "Login gated" },
];

const toolRows = buildRouteMatrix().map((r) => ({
  referenceUrl: r.referenceUrl,
  localUrl: r.localUrl,
  behavior: `${r.template} · ${r.execution}`,
  status: r.status === "demo" ? "demo" : r.status,
  gaps:
    r.status === "external"
      ? "Outbound partner UI"
      : r.execution === "browser-local"
        ? "Raster images only where wired"
        : "Demo adapter; no server codec",
}));

const lines = [
  "# Full route matrix (generated)",
  "",
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "Regenerate: `npx tsx frontend/scripts/export-route-matrix.ts`",
  "",
  "| Reference | Local | Expected | Status | Gaps |",
  "|-----------|-------|----------|--------|------|",
  ...STATIC_ROUTES.map(
    (s) => `| ${s.referenceUrl} | ${s.localUrl} | ${s.behavior} | ${s.status} | ${s.gaps} |`,
  ),
  ...toolRows.map((t) => `| ${t.referenceUrl} | ${t.localUrl} | ${t.behavior} | ${t.status} | ${t.gaps} |`),
  "",
  `Tool routes: ${toolRows.length}`,
];

const out = join(root, "..", "docs", "ROUTE_MATRIX_FULL.md");
writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out} (${toolRows.length} tools + ${STATIC_ROUTES.length} static)`);