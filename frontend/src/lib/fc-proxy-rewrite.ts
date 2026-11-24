import { FREECONVERT_ORIGIN } from "@/lib/freeconvert-url";

const FC_HOST = FREECONVERT_ORIGIN.replace(/^https?:\/\//, "");

/** Rewrite FC absolute and root-relative URLs to same-origin paths (middleware → /fc/*). */
export function rewriteFcUrls(body: string, contentType: string | null): string {
  const type = contentType?.toLowerCase() ?? "";
  const isHtml = type.includes("text/html");
  const isCss = type.includes("text/css");
  const isScript =
    type.includes("javascript") || type.includes("ecmascript") || type.includes("application/json");
  if (!isHtml && !isCss && !isScript) return body;

  let out = body;

  out = out.replace(new RegExp(`https?://${FC_HOST}/?`, "gi"), "/");
  out = out.replace(new RegExp(`//${FC_HOST}/?`, "gi"), "/");

  const attrs = isHtml ? ["href", "src", "action"] : [];
  for (const attr of attrs) {
    out = out.replace(
      new RegExp(`${attr}=("|')/([^"']*)("|')`, "gi"),
      (_m, q1: string, path: string, q2: string) => `${attr}=${q1}/${path}${q2}`,
    );
  }

  if (isHtml) {
    out = out.replace(/href="\/account/gi, 'href="/dashboard');
    out = out.replace(/href='\/account/gi, "href='/dashboard");
    out = out.replace(/to="\/account/gi, 'to="/dashboard');
  }

  if (isCss) {
    out = out.replace(/url\(\s*\//gi, "url(/");
    out = out.replace(/url\(\s*("|')\//gi, 'url($1/');
  }

  return out;
}