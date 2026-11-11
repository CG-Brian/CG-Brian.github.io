import { LargeContentBlock } from "@/components/cards/LargeContentBlock";
import { Section } from "@/components/layout/Section";
import { ConnectionLayer, type Connection } from "@/components/network/ConnectionLayer";
import { DetailLink } from "@/components/ui/DetailLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollCue } from "./ScrollCue";
import { getOutline } from "@/lib/case-studies";
import { cn } from "@/lib/cn";
import type { Annotation } from "@/lib/network";
import { collections, type Collection } from "@/lib/portfolio-data";

type Props = {
  collection: Collection;
  connections: readonly Connection[];
  /** Decorative notes along a boundary column. */
  annotations?: readonly Annotation[];
  /** Mono heading for the content below the first viewport. */
  indexLabel: string;
  /** What one detail page is called in the index, e.g. "Case study". */
  writeupLabel: string;
  /**
   * Quiet note in the first empty column when there are fewer than four entries.
   * It carries the `next-slot` anchor, so the network can end on it.
   */
  emptyNote?: string;
};

// Shared horizontal gutters. Projects' right gutter and Research's left gutter
// together form the space where lines cross between the two sections.
const gutters = "lg:pr-[9vw] lg:pl-[12vw]";

/**
 * Shared layout for Projects and Research: a first viewport dominated by large
 * blocks, followed by an index that the section itself scrolls to.
 */
export function CollectionSection({ collection, connections, annotations, indexLabel, writeupLabel, emptyNote }: Props) {
  const { label, number, entries } = collections[collection];
  const columns = Math.min(4, Math.max(3, entries.length));
  const titleId = `${collection}-title`;

  return (
    <Section id={collection} labelledBy={titleId}>
      {/* First viewport: blocks plus the connection layer that enters from the previous section. */}
      <div className="relative lg:h-full lg:min-h-[600px]">
        <ConnectionLayer connections={connections} annotations={annotations} className="hidden lg:block" />

        <div className={cn("relative z-10 flex flex-col lg:h-full lg:pt-24 lg:pb-20", gutters)}>
          <SectionLabel as="h2" id={titleId} number={number} label={label} />

          <ol
            className="mt-8 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-5"
            style={{ "--cols": columns } as React.CSSProperties}
          >
            {entries.map((entry, i) => (
              <li
                key={entry.slug}
                data-anchor={cn(i === 0 && "first-block", i === entries.length - 1 && "last-block") || undefined}
              >
                <LargeContentBlock entry={entry} href={`/${collection}/${entry.slug}`} />
              </li>
            ))}
            {emptyNote && entries.length < columns && (
              <li aria-hidden className="hidden items-center pl-10 lg:flex">
                {/* Left padding leaves room for the line's end node before the text. */}
                <p data-anchor="next-slot" className="max-w-[28ch] pl-4 font-mono text-[11px] leading-relaxed text-secondary">
                  {emptyNote}
                </p>
              </li>
            )}
          </ol>

          <ScrollCue targetId={`${collection}-index`} label={`Scroll to explore ${indexLabel.toLowerCase()}`} />
        </div>
      </div>

      {/* Below the first viewport: scrolled by the section itself, never by the blocks. */}
      <div className={cn("relative z-10 pt-16 lg:pt-8 lg:pb-32", gutters)}>
        <h3 id={`${collection}-index`} tabIndex={-1} className="font-mono text-xs uppercase tracking-[0.08em] text-secondary outline-none">
          {indexLabel}
        </h3>
        <ol className="mt-6 border-t border-border">
          {entries.map((entry) => {
            const outline = getOutline(collection, entry.slug);
            const written = outline.filter((o) => o.written).length;
            const href = `/${collection}/${entry.slug}`;

            return (
              <li key={entry.slug} className="grid gap-x-6 gap-y-6 border-b border-border py-8 lg:grid-cols-12">
                <div className="flex items-baseline gap-4 lg:col-span-3 lg:block">
                  <span className="font-mono text-xs text-secondary">{entry.id}</span>
                  <div className="lg:mt-3">
                    <h4 className="text-lg font-medium tracking-[-0.015em]">{entry.title}</h4>
                    {entry.status && (
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">{entry.status}</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">Focus</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
                    {entry.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {entry.links && entry.links.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      {entry.links.map((l) =>
                        l.href ? (
                          <li key={l.label}>
                            <a href={l.href} target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent">
                              {l.label} <span aria-hidden>&#8599;</span>
                            </a>
                          </li>
                        ) : (
                          <li key={l.label} className="text-secondary">
                            {l.label} <span className="font-mono text-[10px]">link pending</span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>

                <div className="lg:col-span-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">
                    {writeupLabel} &middot; {written} of {outline.length} sections written
                  </p>
                  <ol className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                    {outline.map((o) => (
                      <li key={o.title} className={o.written ? "text-ink/80" : "text-secondary"}>
                        {o.title}
                        {!o.written && <span className="sr-only"> (not yet written)</span>}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <DetailLink href={href} className="py-2 lg:py-0">
                    Open {writeupLabel.toLowerCase()}
                    <span className="sr-only">: {entry.title}</span>
                  </DetailLink>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
