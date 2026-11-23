"use client";

/** Full-viewport embed of freeconvert.com (parity with FC homepage). */
export function FreeConvertHomeFrame() {
  return (
    <main id="main-content" className="fc-tool-route tool-page--fc-embed" aria-label="FreeConvert home">
      <section className="fc-embed-shell">
        <iframe
          className="fc-embed-frame"
          title="FreeConvert — Online File Converter"
          src="/fc"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
}