"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Chip, PanelLabel } from "./diagram-primitives";

// Synthetic fault, symptoms, questions and weights, written to show the mechanism only.
const FAULT = "Fault X-12 · low discharge pressure";

const observations = [
  { text: "Pressure alarm is active", answer: "yes" },
  { text: "Visible leak at the pump seal", answer: "no" },
  { text: "Inlet filter replaced recently", answer: "unknown" },
] as const;

const questions = [
  { q: "Is the pressure alarm active?", known: 0 },
  { q: "Is there visible leakage at the pump seal?", known: 1 },
  { q: "Is the inlet filter clogged?", known: null },
  { q: "Was the inlet filter replaced recently?", known: 2 },
  { q: "Is the motor drawing normal current?", known: null },
  { q: "Does pressure recover after a restart?", known: null },
] as const;

const causes = [
  { name: "Worn pump seal", before: 45, after: 15 },
  { name: "Clogged inlet filter", before: 35, after: 55 },
  { name: "Drifting pressure sensor", before: 20, after: 30 },
];

export function DynamicFMGuidance() {
  const [proposed, setProposed] = useState(true);
  // Only confirmed yes/no answers skip a question; "unknown" is asked as usual.
  const skipped = (known: number | null) => proposed && known !== null && observations[known].answer !== "unknown";
  const asked = questions.filter((q) => !skipped(q.known)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Workflow">
          {[
            { on: false, label: "Current · full tree" },
            { on: true, label: "Proposed · with confirmed symptoms" },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-pressed={proposed === b.on}
              onClick={() => setProposed(b.on)}
              className={cn(
                "rounded-[3px] border px-3 py-1.5 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                proposed === b.on ? "border-accent text-accent" : "border-border text-secondary hover:text-ink",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
        <p className="rounded-[3px] border border-dashed border-accent/60 px-2 py-0.5 font-mono text-[11px] text-accent">
          Proposed &amp; prototyped · not a production feature
        </p>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] lg:gap-8">
        <section>
          <PanelLabel>1 · Starting context</PanelLabel>
          <Chip className="mt-3">{FAULT}</Chip>
          <div className={cn("mt-4 transition-opacity duration-300", proposed ? "opacity-100" : "opacity-35")}>
            <p className="font-mono text-[11px] text-secondary">Technician observations, confirmed:</p>
            <ul className="mt-2 space-y-1.5">
              {observations.map((o) => (
                <li key={o.text} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="text-ink/85">{o.text}</span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[11px]",
                      o.answer === "unknown" ? "text-secondary" : "text-accent",
                    )}
                  >
                    {o.answer}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              From a checklist, or extracted from free text and then confirmed by the technician.
            </p>
          </div>
        </section>

        <section>
          <PanelLabel>2 · Guided questions</PanelLabel>
          <ol className="mt-3 space-y-1.5" aria-live="polite">
            {questions.map((q, i) => {
              const skip = skipped(q.known);
              return (
                <li key={q.q} className="flex items-baseline gap-3 text-[13px]">
                  <span className="w-4 shrink-0 font-mono text-[11px] text-secondary">{i + 1}</span>
                  <span className={cn("flex-1", skip ? "text-secondary line-through decoration-secondary/50" : "text-ink/85")}>
                    {q.q}
                  </span>
                  {skip && <span className="shrink-0 font-mono text-[10px] text-accent">already confirmed</span>}
                </li>
              );
            })}
          </ol>
          <p className="mt-3 font-mono text-[11px] text-secondary">
            {asked} of {questions.length} questions asked
            {proposed && " · the unknown observation is still asked"}
          </p>
        </section>

        <section>
          <PanelLabel>3 · Candidate causes</PanelLabel>
          <ul className="mt-3 space-y-3">
            {causes.map((c) => {
              const v = proposed ? c.after : c.before;
              return (
                <li key={c.name}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-ink/85">{c.name}</span>
                    <span className="font-mono text-[11px] text-ink">{v}%</span>
                  </div>
                  <span className="mt-1 block h-1.5 bg-border/60">
                    <span
                      className="block h-full bg-accent/70 transition-[width] duration-500 motion-reduce:transition-none"
                      style={{ width: `${v}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-secondary">
            {proposed
              ? "Reweighted, not removed: a cause contradicted by one observation drops in priority but stays reachable."
              : "Prioritized by the deterministic score alone."}
          </p>
        </section>
      </div>
    </div>
  );
}
