import { auth } from "@backend/auth";
import { imageMime, readImageBytes } from "@/lib/image-import";

const providers = {
  dropbox: { entry: ["www.dropbox.com", "dropbox.com", "dl.dropboxusercontent.com"], redirects: ["dropboxusercontent.com", "dropbox.com"] },
  drive: { entry: ["drive.google.com", "drive.usercontent.google.com"], redirects: ["drive.google.com", "drive.usercontent.google.com", "googleusercontent.com"] },
  onedrive: { entry: ["1drv.ms", "onedrive.live.com"], redirects: ["1drv.ms", "onedrive.live.com", "files.1drv.com", "storage.live.com", "livefilestore.com"] },
} as const;

type Provider = keyof typeof providers;

function isProvider(value: unknown): value is Provider {
  return typeof value === "string" && Object.hasOwn(providers, value);
}

function validateUrl(url: URL, hosts: readonly string[], allowSubdomains = false) {
  return url.protocol === "https:" && !url.port && !url.username && !url.password &&
    hosts.some((host) => url.hostname === host || (allowSubdomains && url.hostname.endsWith(`.${host}`)));
}

function downloadUrl(provider: Provider, url: URL) {
  if (provider === "dropbox" && url.hostname !== "dl.dropboxusercontent.com") {
    url.searchParams.delete("raw");
    url.searchParams.set("dl", "1");
  }

  if (provider === "drive" && url.hostname === "drive.google.com") {
    const id = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1] ?? url.searchParams.get("id");
    if (id && /^[\w-]+$/.test(id)) {
      const direct = new URL("https://drive.usercontent.google.com/download");
      direct.searchParams.set("id", id);
      direct.searchParams.set("export", "download");
      const resourceKey = url.searchParams.get("resourcekey");
      if (resourceKey) direct.searchParams.set("resourcekey", resourceKey);
      return direct;
    }
  }

  if (provider === "onedrive" && ["1drv.ms", "onedrive.live.com"].includes(url.hostname)) {
    if (url.pathname === "/embed" || url.searchParams.has("resid")) url.pathname = "/download";
    else url.searchParams.set("download", "1");
  }
  return url;
}

export async function POST(request: Request) {
  if (!(await auth())?.user?.id) return Response.json({ error: "Sign in to import cloud files." }, { status: 401 });

  const data = await request.json().catch(() => null);
  const provider: unknown = data?.provider;
  const address: unknown = data?.url;
  if (!isProvider(provider) || typeof address !== "string" || address.length > 4096 || !URL.canParse(address)) {
    return Response.json({ error: "Enter a valid cloud share link." }, { status: 400 });
  }

  let url = new URL(address);
  const policy = providers[provider];
  if (!validateUrl(url, policy.entry)) {
    return Response.json({ error: "Enter an HTTPS share link from the selected provider." }, { status: 400 });
  }

  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(20_000)]);
  try {
    for (let redirects = 0; redirects <= 5; redirects++) {
      url = downloadUrl(provider, url);
      if (!validateUrl(url, policy.redirects, true)) break;
      const response = await fetch(url, { redirect: "manual", cache: "no-store", signal });
      if (response.status >= 300 && response.status < 400) {
        await response.body?.cancel();
        const location = response.headers.get("location");
        if (!location) break;
        url = new URL(location, url);
        continue;
      }
      if (!response.ok || response.headers.get("content-type")?.includes("text/html")) {
        await response.body?.cancel();
        break;
      }

      const image = await readImageBytes(response);
      const mime = await imageMime(image);
      if (!mime) break;
      return new Response(image, {
        headers: { "Content-Type": mime, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Choose an image smaller")) {
      return Response.json({ error: error.message }, { status: 413 });
    }
  }

  return Response.json({
    error: "Could not download this image. Use a public JPG, PNG, or WebP share link with downloads enabled, or download the file and choose From Device.",
  }, { status: 422 });
}
