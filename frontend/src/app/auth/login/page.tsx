import type { Metadata } from "next";
import { FreeConvertEmbedPage } from "@/components/user/freeconvert-embed-page";

export const metadata: Metadata = {
  title: { absolute: "Log In - FreeConvert.com" },
};

export default function FcLoginPage() {
  return <FreeConvertEmbedPage fcPath="auth/login" title="Log In" />;
}