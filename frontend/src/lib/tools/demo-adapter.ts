import type { DemoJobResult, QueuedFile, ToolRecord } from "@/lib/tools/types";

/** Typed adapter for customer-facing demo jobs (no server conversion yet). */
export type ProcessRequest = {
  tool: ToolRecord;
  files: QueuedFile[];
  outputFormat?: string;
};

export interface ConversionAdapter {
  process(request: ProcessRequest): Promise<DemoJobResult>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class DemoConversionAdapter implements ConversionAdapter {
  async process(request: ProcessRequest): Promise<DemoJobResult> {
    const valid = request.files.filter((f) => f.status === "valid");
    if (valid.length === 0) {
      return { status: "failed", message: "No valid files to process." };
    }
    await sleep(900);
    const firstInvalid = request.files.find((f) => f.status !== "valid");
    if (firstInvalid && valid.length < request.files.length) {
      return {
        status: "complete",
        message: `${valid.length} file(s) processed (demo). ${request.files.length - valid.length} skipped due to validation.`,
        outputLabel: request.tool.defaultOutput ?? request.tool.outputFormats?.[0] ?? "output",
        sampleOutput: true,
      };
    }
    return {
      status: "complete",
      message: `Demo ${request.tool.convertLabel.toLowerCase()} finished for ${valid.length} file(s). Connect a real adapter to generate downloadable output.`,
      outputLabel: request.tool.defaultOutput ?? request.tool.outputFormats?.[0] ?? "output",
      sampleOutput: true,
    };
  }
}

export const demoConversionAdapter = new DemoConversionAdapter();