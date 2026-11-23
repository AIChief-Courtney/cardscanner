import type { ToolPageMeta } from "@/lib/tool-registry";
import { FreeConvertToolFrame } from "@/components/user/freeconvert-tool-frame";

/** One layout for every catalog tool: proxied FreeConvert.com page for that slug. */
export function ToolFreeConvertPage({ meta }: { meta: ToolPageMeta }) {
  return (
    <main id="main-content" className="fc-tool-route tool-page--fc-embed" aria-label={meta.h1}>
      <FreeConvertToolFrame meta={meta} />
    </main>
  );
}