import type { ToolPageMeta } from "@/lib/tool-registry";

export type ToolStep = { title: string; body: string };
export type ToolFeature = { title: string; body: string };

export type ToolPageContent = {
  aboutTitle: string;
  aboutParagraphs: string[];
  stepsTitle: string;
  steps: ToolStep[];
  featuresTitle: string;
  features: ToolFeature[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
};

const PRIVACY =
  "Our converter is free and works in your browser. Files are protected with 256-bit SSL encryption and automatically deleted after 8 hours. We guarantee file security and privacy.";

export function toolPrivacyNote() {
  return PRIVACY;
}

function actionNoun(meta: ToolPageMeta): string {
  if (meta.slug.startsWith("compress")) return "compression";
  if (meta.convertLabel === "Apply") return "processing";
  if (meta.slug === "merge-pdf") return "merge";
  return "conversion";
}

export function buildToolPageContent(meta: ToolPageMeta): ToolPageContent {
  const name = meta.h1;
  const action = actionNoun(meta);

  const aboutParagraphs = [
    `${meta.tagline}`,
    `Upload ${meta.fileSupported} files, pick an output format when available, then run ${action} in the workspace above.`,
  ];

  const steps: ToolStep[] = [
    {
      title: "Choose Files",
      body: `Click the “Choose Files” button to select your files (${meta.fileSupported}). You can also drag and drop into the upload area.`,
    },
    {
      title: meta.convertLabel,
      body: `Click “${meta.convertLabel}” to start ${action}. When the status changes to “Done”, your result is ready.`,
    },
    {
      title: "Download",
      body: `Click “Download” to save the output${meta.outputHint ? ` as ${meta.outputHint}` : ""}, or copy from the result panel.`,
    },
  ];

  const features: ToolFeature[] = [
    {
      title: "Easy to Use",
      body: `Simply upload your files and click the ${meta.convertLabel.toLowerCase()} button. Batch uploads roll out with Pro.`,
    },
    {
      title: "Best Quality",
      body: 'Fine-tune options using “Advanced Settings” when available (optional — look for the gear icon).',
    },
    {
      title: "Free & Secure",
      body: "Free to try in the browser on FileDock. Demo mode keeps files local unless a live adapter is connected.",
    },
  ];

  const faqs = [
    {
      q: `What file types does ${name} support?`,
      a: `This tool accepts: ${meta.fileSupported}.`,
    },
    {
      q: "How do I convert for free?",
      a: `Open this page, upload your file, click “${meta.convertLabel}”, then download the result — no install required.`,
    },
    {
      q: "Is it safe to upload my files?",
      a: "Uploads use SSL encryption. Do not upload highly sensitive data until your organization has reviewed our retention policy.",
    },
    {
      q: "Do I need an account?",
      a: "No account is required to try the tool. Sign in from the header to use your dashboard and balance.",
    },
  ].map(({ q, a }) => ({ q, a }));

  return {
    aboutTitle: `How to use ${name}`,
    aboutParagraphs,
    stepsTitle: `How to ${meta.convertLabel}?`,
    steps,
    featuresTitle: "Why use this tool",
    features,
    faqTitle: "Frequently asked questions",
    faqs,
  };
}