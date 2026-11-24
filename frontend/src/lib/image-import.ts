export const maxImageBytes = 25 * 1024 * 1024;
export const imageLimitText = "25 MB";

export async function readImageBytes(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("The link returned no file.");

  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let received = 0;

  try {
    if (Number(response.headers.get("content-length")) > maxImageBytes) {
      throw new Error(`Choose an image smaller than ${imageLimitText}.`);
    }
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxImageBytes) throw new Error(`Choose an image smaller than ${imageLimitText}.`);
      chunks.push(new Uint8Array(value));
    }
    return new Blob(chunks);
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function imageMime(blob: Blob) {
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  const prefix = String.fromCharCode(...bytes);
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (prefix.startsWith("\x89PNG\r\n\x1a\n")) return "image/png";
  if (prefix.startsWith("RIFF") && prefix.slice(8) === "WEBP") return "image/webp";
  return null;
}
