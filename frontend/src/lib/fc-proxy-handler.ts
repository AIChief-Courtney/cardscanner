import { FREECONVERT_ORIGIN } from "@/lib/freeconvert-url";
import { rewriteFcUrls } from "@/lib/fc-proxy-rewrite";

const FORWARD_HEADERS = ["content-type", "cache-control", "etag", "last-modified", "set-cookie"];

const REWRITABLE = /text\/html|text\/css|application\/javascript|text\/javascript|application\/json/i;

const STRIP_REQUEST_HEADERS = new Set(["host", "connection", "content-length", "transfer-encoding"]);

export async function proxyFreeConvert(request: Request, path: string): Promise<Response> {
  const target = `${FREECONVERT_ORIGIN}/${path}${new URL(request.url).search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (STRIP_REQUEST_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  headers.set("User-Agent", "CardScanner-FC-Proxy/1.0");
  headers.set("Origin", FREECONVERT_ORIGIN);
  headers.set("Referer", `${FREECONVERT_ORIGIN}/${path}`);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const contentType = upstream.headers.get("content-type");

  const outHeaders = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) outHeaders.set(name, value);
  }
  outHeaders.delete("x-frame-options");
  outHeaders.delete("content-security-policy");
  outHeaders.delete("content-security-policy-report-only");
  outHeaders.set("X-FC-Proxy", "1");

  if (contentType && REWRITABLE.test(contentType)) {
    const text = await upstream.text();
    const rewritten = rewriteFcUrls(text, contentType);
    return new Response(rewritten, { status: upstream.status, headers: outHeaders });
  }

  const body = await upstream.arrayBuffer();
  return new Response(body, { status: upstream.status, headers: outHeaders });
}