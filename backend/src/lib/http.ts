import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function isPrismaClientError(error: unknown): error is { code: string; meta?: unknown } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("P")
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError)
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );

  if (process.env.NODE_ENV !== "production") {
    console.error("[api]", error);
  }

  if (isPrismaClientError(error)) {
    const code = error.code;
    const devDetail =
      process.env.NODE_ENV !== "production" ? ` Database error (${code}).` : "";
    const schemaHint =
      code === "P2021" || code === "P2022" || code === "P2010"
        ? " Run npm run db:migrate and restart the dev server."
        : "";
    return NextResponse.json(
      {
        error: {
          code: "DATABASE_ERROR",
          message: `We could not reach the database or the schema is out of date.${devDetail}${schemaHint}`,
        },
      },
      { status: 503 },
    );
  }

  if (error instanceof Error) {
    const devMessage =
      process.env.NODE_ENV !== "production"
        ? error.message
        : "The service is temporarily unavailable. Please try again.";
    return NextResponse.json(
      {
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: devMessage,
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "The service is temporarily unavailable. Please try again.",
      },
    },
    { status: 503 },
  );
}

export function clientRateKey(req: Request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must have at least 32 characters");
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return createHmac("sha256", secret).update(ip).digest("hex");
}

const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function configuredAuthOrigin(): string | null {
  const raw = process.env.AUTH_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

function originWithHost(protocol: string, host: string): string {
  return `${protocol}//${host}`;
}

/** Origins that are allowed for this request (Host header is the browser truth). */
function allowedOrigins(req: Request): Set<string> {
  const allowed = new Set<string>();

  try {
    allowed.add(new URL(req.url).origin);
  } catch {
    /* ignore */
  }

  const host = req.headers.get("host")?.trim();
  if (host) {
    const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protos = forwardedProto ? [forwardedProto] : ["http", "https"];
    for (const proto of protos) {
      allowed.add(originWithHost(`${proto}:`, host));
    }
  }

  const authOrigin = configuredAuthOrigin();
  if (authOrigin) allowed.add(authOrigin);

  if (process.env.AUTH_TRUST_HOST === "true" && process.env.NODE_ENV !== "production") {
    const devOrigins = [...allowed];
    for (const entry of devOrigins) {
      try {
        const u = new URL(entry);
        if (!LOOPBACK.has(u.hostname)) continue;
        const port = u.port ? `:${u.port}` : "";
        allowed.add(`${u.protocol}//localhost${port}`);
        allowed.add(`${u.protocol}//127.0.0.1${port}`);
      } catch {
        /* ignore */
      }
    }
  }

  return allowed;
}

function originMatchesHost(origin: string, req: Request): boolean {
  const host = req.headers.get("host")?.trim();
  if (!host) return false;
  try {
    const originUrl = new URL(origin);
    const [hostName, hostPort] =
      host.startsWith("[") && host.includes("]")
        ? [host, ""]
        : host.includes(":")
          ? host.split(":", 2)
          : [host, ""];
    const defaultPort = originUrl.protocol === "https:" ? "443" : "80";
    const expectedPort = hostPort || defaultPort;
    const actualPort = originUrl.port || defaultPort;
    return originUrl.hostname === hostName && actualPort === expectedPort;
  } catch {
    return false;
  }
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const allowed = allowedOrigins(req);

  const check = (value: string) => {
    if (allowed.has(value)) return true;
    if (process.env.NODE_ENV !== "production" && originMatchesHost(value, req)) return true;
    return false;
  };

  if (origin) {
    if (check(origin)) return;
  } else {
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        if (check(new URL(referer).origin)) return;
      } catch {
        /* ignore */
      }
    }
    return;
  }

  const hint =
    process.env.NODE_ENV !== "production"
      ? ` Use ${[...allowed].join(" or ")} in the browser, or set AUTH_URL to your current origin.`
      : "";
  throw new ApiError("INVALID_ORIGIN", `Request origin is not allowed.${hint}`, 403);
}

export async function jsonBody(req: Request) {
  const text = await req.text();
  if (Buffer.byteLength(text) > 30000)
    throw new ApiError("INVALID_INPUT", "Request is too large.", 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("INVALID_INPUT", "Invalid JSON.");
  }
}