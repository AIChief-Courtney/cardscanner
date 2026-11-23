import type { Metadata } from "next";
import { FreeConvertEmbedPage } from "@/components/user/freeconvert-embed-page";

export const metadata: Metadata = {
  title: { absolute: "Pricing - FreeConvert.com" },
  description: "Upgrade for more file size, batch conversions, and priority processing.",
};

export default function PricingPage() {
  return <FreeConvertEmbedPage fcPath="pricing" title="Pricing" />;
}