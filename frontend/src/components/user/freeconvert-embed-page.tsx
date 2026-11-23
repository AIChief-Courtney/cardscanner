import type { Metadata } from "next";
import { FreeConvertHomeFrame } from "@/components/user/freeconvert-home-frame";

type Props = {
  fcPath: string;
  title?: string;
  description?: string;
};

/** Full-viewport FC proxy embed (e.g. /pricing → freeconvert.com/pricing). */
export function fcEmbedMetadata({ title, description }: Pick<Props, "title" | "description">): Metadata {
  return {
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
  };
}

export function FreeConvertEmbedPage({ fcPath, title }: Props & { title: string }) {
  const src = fcPath ? `/fc/${fcPath.replace(/^\//, "")}` : "/fc/";
  return (
    <main id="main-content" className="fc-tool-route tool-page--fc-embed" aria-label={title}>
      <section className="fc-embed-shell">
        <iframe
          className="fc-embed-frame"
          title={title}
          src={src}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
}

export function FreeConvertRootEmbed() {
  return <FreeConvertHomeFrame />;
}