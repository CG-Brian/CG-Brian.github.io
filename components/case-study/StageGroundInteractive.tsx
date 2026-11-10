"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PanelLabel } from "./diagram-primitives";

/* --------------------------------------------------------- metric explorer */

// Pooled across T, N and M; from metrics.json of the committed 1,000-case run.
const results = [
  { arm: "A", name: "Zero-shot", accuracy: 68.9, coverage: 93.5, unsupported: 59.4, supported: 26.6 },
  { arm: "C", name: "Constrained", accuracy: 70.2, coverage: 88.9, unsupported: 51.7, supported: 29.8 },
  { arm: "C+", name: "Constrained + unknown", accuracy: 62.9, coverage: 77.2, unsupported: 44.0, supported: 27.5 },
  { arm: "D", name: "Grounded", accuracy: 62.3, coverage: 79.7, unsupported: 40.4, supported: 31.1 },
];

type Arm = (typeof results)[number];
type Series = { key: keyof Omit<Arm, "arm" | "name">; label: string; tone: "ink" | "accent" | "muted" };

const views: { id: string; label: string; note: string; series: Series[] }[] = [
  {
    id: "accuracy",
    label: "Accuracy vs. supported",
    note: "Higher is better for both. Note which arm wins each.",
    series: [
      { key: "accuracy", label: "Accuracy", tone: "ink" },
      { key: "supported", label: "Semantic-supported accuracy", tone: "accent" },
    ],
  },
  {
    id: "unsupported",
    label: "Unsupported rate",
    note: "Lower is better: asserted predictions whose evidence was missing or didn’t support the label.",
    series: [{ key: "unsupported", label: "Semantic-unsupported rate", tone: "muted" }],
  },
  {
    id: "coverage",
    label: "Coverage",
    note: "Share of predictions that weren’t “unknown”. Not better or worse on its own.",
    series: [{ key: "coverage", label: "Coverage", tone: "muted" }],
  },
];

const barTone = { ink: "bg-ink/80", accent: "bg-accent", muted: "bg-secondary/60" };

export function MetricExplorer() {
  const [viewId, setViewId] = useState(views[0].id);
  const view = views.find((v) => v.id === viewId) ?? views[0];
  const best = (key: Series["key"]) => {
    const values = results.map((r) => r[key]);
    return key === "unsupported" ? Math.min(...values) : Math.max(...values);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Metric">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === viewId}
            onClick={() => setViewId(v.id)}
            className={cn(
              "rounded-[3px] border px-3 py-1.5 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              v.id === viewId ? "border-accent text-accent" : "border-border text-secondary hover:text-ink",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-secondary">{view.note}</p>

      <ul className="mt-6 space-y-5">
        {results.map((r) => (
          <li key={r.arm} className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
            <p className="flex items-baseline gap-2">
              <span className="w-7 font-mono text-[13px] text-ink">{r.arm}</span>
              <span className="text-sm text-secondary">{r.name}</span>
            </p>
            <div className="space-y-1.5">
              {view.series.map((s) => {
                const value = r[s.key];
                const isBest = value === best(s.key) && view.id !== "coverage";
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="h-2 flex-1 bg-border/60">
                      <span
                        className={cn("block h-full transition-[width] duration-500 motion-reduce:transition-none", barTone[s.tone])}
                        style={{ width: `${value}%` }}
                      />
                    </span>
                    <span className={cn("w-24 shrink-0 text-right font-mono text-[12px]", isBest ? "text-accent" : "text-ink")}>
                      {value.toFixed(1)}%{isBest && <span className="text-[10px]"> best</span>}
                      <span className="sr-only"> {s.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {view.series.length > 1 && (
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-secondary">
          {view.series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-2">
              <span aria-hidden className={cn("inline-block h-2 w-4", barTone[s.tone])} />
              {s.label}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------- evidence inspector */

// Synthetic excerpt written for illustration. Not from TCGA or any real patient.
const excerpt = [
  "Specimen received in formalin, labeled with patient name.",
  "Tumor invades into but not through the muscularis propria.",
  "Lymph nodes: 0 of 14 involved by carcinoma.",
  "Surgical margins are negative.",
];

type Case = {
  id: number;
  title: string;
  target: string;
  prediction: string;
  registry: string;
  quote: number | null;
  correct: boolean;
  spanFound: boolean | null;
  supports: boolean | null;
  verdict: string;
};

const cases: Case[] = [
  {
    id: 1,
    title: "Correct, and the evidence says so",
    target: "N",
    prediction: "N0",
    registry: "N0",
    quote: 2,
    correct: true,
    spanFound: true,
    supports: true,
    verdict: "Counts toward accuracy and toward semantic-supported accuracy.",
  },
  {
    id: 2,
    title: "Correct, but the evidence doesn’t say so",
    target: "M",
    prediction: "M0",
    registry: "M0",
    quote: 3,
    correct: true,
    spanFound: true,
    supports: false,
    verdict: "Accuracy counts it. Negative margins say nothing about distant metastasis.",
  },
  {
    id: 3,
    title: "Wrong, with a real but irrelevant quote",
    target: "T",
    prediction: "T3",
    registry: "T2",
    quote: 0,
    correct: false,
    spanFound: true,
    supports: false,
    verdict: "The quote exists in the report. That’s all it has going for it.",
  },
  {
    id: 4,
    title: "Abstains when the report is silent",
    target: "M",
    prediction: "unknown",
    registry: "M0",
    quote: null,
    correct: false,
    spanFound: null,
    supports: null,
    verdict: "Counted as wrong by accuracy, lowers coverage, and asserts nothing unsupported.",
  },
];

function Check({ value, label }: { value: boolean | null; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-1.5 text-[13px]">
      <span className="text-secondary">{label}</span>
      <span className={cn("font-mono text-[12px]", value === null ? "text-secondary" : value ? "text-accent" : "text-ink")}>
        {value === null ? "n/a" : value ? "yes" : "no"}
      </span>
    </div>
  );
}

export function EvidenceInspection() {
  const [selected, setSelected] = useState(1);
  const c = cases.find((x) => x.id === selected) ?? cases[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Example prediction">
        {cases.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={x.id === selected}
            onClick={() => setSelected(x.id)}
            className={cn(
              "rounded-[3px] border px-3 py-1.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              x.id === selected ? "border-accent text-accent" : "border-border text-secondary hover:text-ink",
            )}
          >
            <span className="mr-1.5 font-mono text-[11px]">{x.id}</span>
            {x.title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <PanelLabel>Illustrative report excerpt</PanelLabel>
          <div className="mt-3 rounded-[3px] border border-border px-4 py-3 font-mono text-[12px] leading-[1.9] text-secondary">
            {excerpt.map((line, i) => (
              <p
                key={line}
                className={cn(
                  "-mx-1.5 rounded-[2px] px-1.5 transition-colors duration-300",
                  c.quote === i && (c.supports ? "bg-accent/10 text-accent" : "bg-ink/[0.06] text-ink"),
                )}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] text-secondary">Synthetic text, written for this page.</p>
        </div>

        <div aria-live="polite">
          <PanelLabel>
            Prediction &middot; {c.target} stage
          </PanelLabel>
          <p className="mt-3 flex items-baseline gap-3">
            <span className={cn("font-mono text-2xl", c.prediction === "unknown" ? "text-secondary" : "text-ink")}>
              {c.prediction}
            </span>
            <span className="font-mono text-[11px] text-secondary">registry: {c.registry}</span>
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/85">
            {c.quote === null ? (
              <span className="text-secondary">No evidence cited.</span>
            ) : (
              <>
                Cites: <span className="font-mono text-[12px]">&ldquo;{excerpt[c.quote]}&rdquo;</span>
              </>
            )}
          </p>
          <div className="mt-4">
            <Check label="Matches registry" value={c.correct} />
            <Check label="Quote found in report" value={c.spanFound} />
            <Check label="Quote supports the label" value={c.supports} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-secondary">{c.verdict}</p>
        </div>
      </div>
    </div>
  );
}
