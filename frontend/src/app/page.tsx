import type { Metadata } from "next";
import { FreeConvertHomeFrame } from "@/components/user/freeconvert-home-frame";

/** Title aligned with freeconvert.com homepage. */
export const metadata: Metadata = {
  title: { absolute: "File Converter - FreeConvert.com" },
  description: "Easily convert files from one format to another, online.",
};

export default function Home() {
  return <FreeConvertHomeFrame />;
}