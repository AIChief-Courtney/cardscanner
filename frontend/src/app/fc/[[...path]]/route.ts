import { proxyFreeConvert } from "@/lib/fc-proxy-handler";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };

async function handle(request: Request, context: Ctx) {
  const { path: segments } = await context.params;
  const path = (segments ?? []).join("/") || "";
  return proxyFreeConvert(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;