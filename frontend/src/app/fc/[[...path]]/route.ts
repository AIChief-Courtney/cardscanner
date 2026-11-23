import { FREECONVERT_ORIGIN } from "@/lib/freeconvert-url";
import { rewriteFcUrls } from "@/lib/fc-proxy-rewrite";

export const dynamic = "force-dynamic";

const FORWARD_HEADERS = ["content-type", "cache-control", "etag", "last-modified"];

const REWRITABLE = /text\/html|text\/css/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path: segments } = await context.params;
  const path = (segments ?? []).join("/") || "";
  const target = `${FREECONVERT_ORIGIN}/${path}`;

  const upstream = await fetch(target, {
    headers: { "User-Agent": "CardScanner-FC-Proxy/1.0" },
    redirect: "follow",
  });

  const contentType = upstream.headers.get("content-type");
  const headers = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.delete("x-frame-options");
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.set("X-FC-Proxy", "1");

  if (contentType && REWRITABLE.test(contentType)) {
    const text = await upstream.text();
    const rewritten = rewriteFcUrls(text, contentType);
    return new Response(rewritten, { status: upstream.status, headers });
  }

  const body = await upstream.arrayBuffer();
  return new Response(body, { status: upstream.status, headers });
}