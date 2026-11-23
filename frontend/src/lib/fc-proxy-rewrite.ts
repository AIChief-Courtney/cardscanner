import { FREECONVERT_ORIGIN } from "@/lib/freeconvert-url";

const FC_HOST = FREECONVERT_ORIGIN.replace(/^https?:\/\//, "");

/** Keep proxied FC navigation and assets on /fc/* when rendered under localhost. */
export function rewriteFcUrls(body: string, contentType: string | null): string {
  const type = contentType?.toLowerCase() ?? "";
  const isHtml = type.includes("text/html");
  const isCss = type.includes("text/css");
  if (!isHtml && !isCss) return body;

  let out = body;

  out = out.replace(new RegExp(`https?://${FC_HOST}/`, "gi"), "/fc/");
  out = out.replace(new RegExp(`//${FC_HOST}/`, "gi"), "/fc/");

  const attrs = isHtml ? ["href", "src", "action"] : [];
  for (const attr of attrs) {
    out = out.replace(
      new RegExp(`${attr}=("|')/(?!fc/)([^"']*)("|')`, "gi"),
      (_m, q1: string, path: string, q2: string) => `${attr}=${q1}/fc/${path}${q2}`,
    );
  }

  if (isCss) {
    out = out.replace(/url\(\s*\/(?!fc\/)/gi, "url(/fc/");
    out = out.replace(/url\(\s*("|')\/(?!fc\/)/gi, 'url($1/fc/');
  }

  return out.replace(/\/fc\/fc\//g, "/fc/");
}