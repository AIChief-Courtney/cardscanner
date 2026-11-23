import Link from "next/link";
import type { ComponentProps } from "react";
import { isFreeConvertHref } from "@/lib/freeconvert-url";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function ToolNavLink({ href, ...rest }: Props) {
  if (isFreeConvertHref(href)) {
    return <a href={href} {...(rest as ComponentProps<"a">)} />;
  }
  return <Link href={href} {...rest} />;
}