"use client";

import { sections } from "@/lib/portfolio-data";

type Props = {
  active: number;
  onNavigate: (index: number) => void;
};

const buttonClass =
  "inline-flex h-9 items-center gap-2 rounded-[3px] border border-border bg-canvas px-3 text-[13px] text-ink transition-colors hover:border-ink/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Previous / next controls for the desktop horizontal journey, named after the sections
 * they lead to. A direction that doesn't exist (first or last section) isn't rendered.
 */
export function SectionNavigation({ active, onNavigate }: Props) {
  const prev = sections[active - 1];
  const next = sections[active + 1];

  return (
    <nav
      aria-label="Previous and next section"
      className="fixed right-8 bottom-6 z-40 hidden items-center gap-3 lg:flex xl:right-16"
    >
      {prev && (
        <button type="button" className={buttonClass} onClick={() => onNavigate(active - 1)}>
          <span aria-hidden>&larr;</span>
          <span className="sr-only">Previous section: </span>
          {prev.label}
        </button>
      )}
      <span className="px-1 font-mono text-[11px] text-secondary" aria-live="polite">
        <span className="text-ink">{sections[active].number}</span> / {sections.at(-1)!.number}
        <span className="sr-only">: {sections[active].label}</span>
      </span>
      {next && (
        <button type="button" className={buttonClass} onClick={() => onNavigate(active + 1)}>
          <span className="sr-only">Next section: </span>
          {next.label}
          <span aria-hidden>&rarr;</span>
        </button>
      )}
    </nav>
  );
}
