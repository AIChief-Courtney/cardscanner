import type { ToolPageMeta } from "@/lib/tool-registry";
import { FreeConvertToolFrame } from "@/components/user/freeconvert-tool-frame";

/** One layout for every catalog tool: proxied FreeConvert.com page for that slug. */
export function ToolFreeConvertPage({ meta }: { meta: ToolPageMeta }) {
  return (
    <div className="fc-tool-route">
      <FreeConvertToolFrame meta={meta} />
    </div>
  );
}