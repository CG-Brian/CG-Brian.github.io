"use client";

import { sections } from "@/lib/portfolio-data";

type Props = {
  active: number;
  onNavigate: (index: number) => void;
};

const buttonClass =
  "inline-flex size-9 items-center justify-center rounded-[3px] border border-border bg-canvas text-sm text-ink transition-colors hover:border-ink/40 hover:text-accent disabled:pointer-events-none disabled:opacity-35";

/** Previous / next controls for the desktop horizontal journey. */
export function SectionNavigation({ active, onNavigate }: Props) {
  const prev = sections[active - 1];
  const next = sections[active + 1];

  return (
    <nav
      aria-label="Previous and next section"
      className="fixed right-8 bottom-6 z-40 hidden items-center gap-3 lg:flex xl:right-16"
    >
      <span className="mr-1 font-mono text-[11px] text-secondary" aria-live="polite">
        <span className="text-ink">{sections[active].number}</span> / {sections.at(-1)!.number}
        <span className="sr-only">: {sections[active].label}</span>
      </span>
      <button
        type="button"
        className={buttonClass}
        disabled={!prev}
        onClick={() => onNavigate(active - 1)}
        aria-label={prev ? `Previous section: ${prev.label}` : "Previous section"}
      >
        <span aria-hidden>&larr;</span>
      </button>
      <button
        type="button"
        className={buttonClass}
        disabled={!next}
        onClick={() => onNavigate(active + 1)}
        aria-label={next ? `Next section: ${next.label}` : "Next section"}
      >
        <span aria-hidden>&rarr;</span>
      </button>
    </nav>
  );
}
