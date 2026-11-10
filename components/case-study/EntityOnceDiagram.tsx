"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Chip, Edge, PanelLabel } from "./diagram-primitives";

// Synthetic example: one sensor that takes part in three relationships.
const RAW = "temp sens #1 (N)";
const CANONICAL = "Temperature Sensor 01";

const relationships = [
  { target: "Cooling fan", attribute: "starts above 40 °C" },
  { target: "Alarm panel", attribute: "warns above 60 °C" },
  { target: "Shutoff valve", attribute: "closes above 80 °C" },
];

/** Plausible readings of the same raw label, each a reasonable guess in isolation. */
const readings = ["Temperature Sensor 1", "North Temp Probe", "Thermal Sensor 01", "Temp. Sensor (North)", "Sensor #1, Temperature"];

/** Which reading each relationship gets on each run. Sometimes they agree, which is almost worse. */
const runs = [
  [0, 1, 2],
  [3, 3, 0],
  [1, 4, 1],
  [2, 0, 3],
];

const EASE = [0.2, 0, 0, 1] as const;

export function EntityOnceDiagram() {
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion();
  const picks = runs[run % runs.length].map((i) => readings[i]);
  const distinct = new Set(picks).size;

  const swap = {
    initial: { opacity: 0, y: reduce ? 0 : 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.25, ease: EASE },
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <p className="max-w-[52ch] text-sm leading-relaxed text-secondary">
          One sensor, written as <Chip className="mx-0.5 py-0 text-[11px]">{RAW}</Chip>, takes part in three
          relationships. Ask for a fresh run and watch which side changes its mind.
        </p>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex items-center gap-2 rounded-[3px] border border-border px-3 py-2 font-mono text-[12px] text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Run again <span aria-hidden>&#8635;</span>
          <span className="text-secondary">#{run + 1}</span>
        </button>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-0">
        {/* Before */}
        <section aria-labelledby="eo-before" className="lg:border-r lg:border-border lg:pr-8">
          <PanelLabel>
            <span id="eo-before">Before &middot; normalize per relationship</span>
          </PanelLabel>
          <ul className="mt-4">
            {relationships.map((rel, i) => (
              <li key={rel.target} className="border-b border-border py-3 last:border-b-0">
                <p className="font-mono text-[11px] text-secondary">
                  {RAW} + {rel.target}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="shrink-0 font-mono text-[10px] text-secondary">LLM</span>
                  <Edge tone="muted" />
                  <span className="relative inline-grid">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={`${run}-${i}`} {...swap} className="col-start-1 row-start-1">
                        <Chip>{picks[i]}</Chip>
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="mt-4 font-mono text-[11px] text-secondary">
            1 sensor &middot; <span className="text-ink">{distinct}</span> different {distinct === 1 ? "name" : "names"} this run
          </p>
        </section>

        {/* After */}
        <section aria-labelledby="eo-after" className="lg:pl-8">
          <PanelLabel>
            <span id="eo-after">After &middot; normalize the entity once</span>
          </PanelLabel>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 pt-3">
            <Chip tone="muted">{RAW}</Chip>
            <span className="font-mono text-[10px] text-secondary">normalized once &darr;</span>
          </div>
          <span aria-hidden className="ml-3 block h-4 w-px bg-connection" />
          <Chip tone="accent">{CANONICAL}</Chip>
          {/* One canonical entity feeds every relationship. */}
          <ul className="ml-3 border-l border-accent/40 pl-4">
            {relationships.map((rel) => (
              <li key={rel.target} className="flex items-center py-2">
                <span aria-hidden className="mr-2 -ml-[20.5px] size-[6px] shrink-0 rounded-full border border-accent bg-canvas" />
                <span className="sr-only">{CANONICAL}</span>
                <Edge label={rel.attribute} />
                <Chip>{rel.target}</Chip>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-secondary">
            1 sensor &middot; <span className="text-accent">1</span> name, every run &middot; conditions live on the
            relationships
          </p>
        </section>
      </div>
    </div>
  );
}
