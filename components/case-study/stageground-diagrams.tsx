/**
 * Figures for the StageGround research case study.
 * Every number comes from the committed 1,000-case run
 * (results/20260908T022659_gpt-4o_seed42_n1000) or the BB-TEN baseline summary in the
 * StageGround repository. Report text, where shown, is synthetic.
 */
import { cn } from "@/lib/cn";
import { PanelLabel, Pipeline } from "./diagram-primitives";

/* ------------------------------------------------- progressive interventions */

const interventions = ["Allowed values", "Explicit abstention", "Mandatory evidence"] as const;

const arms = [
  { code: "A", name: "Zero-shot", adds: "Baseline", has: 0 },
  { code: "C", name: "Constrained", adds: "+ allowed TNM values", has: 1 },
  { code: "C+", name: "Constrained + unknown", adds: "+ explicit abstention", has: 2 },
  { code: "D", name: "Grounded", adds: "+ mandatory verbatim evidence", has: 3 },
];

export function ArmProgression() {
  return (
    <div>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {arms.map((a, i) => (
          <li key={a.code} className={cn("relative lg:px-5", i > 0 && "lg:border-l lg:border-border", i === 0 && "lg:pl-0")}>
            <p className={cn("font-mono text-4xl tracking-[-0.03em] sm:text-5xl", i === 3 ? "text-accent" : "text-ink")}>{a.code}</p>
            <p className="mt-3 text-[15px] font-medium">{a.name}</p>
            <p className={cn("mt-1 font-mono text-[11px]", i === 0 ? "text-secondary" : "text-accent")}>{a.adds}</p>
            <ul className="mt-4 space-y-1.5">
              {interventions.map((label, j) => {
                const on = j < a.has;
                return (
                  <li key={label} className={cn("flex items-center gap-2 text-xs", on ? "text-ink/85" : "text-secondary")}>
                    <span
                      aria-hidden
                      className={cn("size-[7px] shrink-0 rounded-full border", on ? "border-accent bg-accent" : "border-secondary bg-canvas")}
                    />
                    {label}
                    <span className="sr-only">{on ? ": applied" : ": not applied"}</span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-8 border-t border-border pt-4 font-mono text-[11px] leading-relaxed text-secondary">
        Same 1,000 reports &middot; same GPT-4o configuration &middot; T, N and M for every report &middot; 1,000 &times; 4
        &times; 3 = 12,000 prediction records
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ the M0 paradox */

const m0 = [
  { arm: "A", n: 431, accuracy: 98.8, supported: 2.1 },
  { arm: "C", n: 450, accuracy: 99.1, supported: 2.0 },
  { arm: "C+", n: 248, accuracy: 99.2, supported: 3.2 },
  { arm: "D", n: 222, accuracy: 99.1, supported: 4.1 },
];

export function M0Paradox() {
  return (
    <div>
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
        <div>
          <p className="text-6xl font-medium tracking-[-0.04em] text-ink sm:text-7xl">~99%</p>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-snug text-ink/85">of M0 predictions matched the registry label</p>
        </div>
        <div>
          <p className="text-6xl font-medium tracking-[-0.04em] text-accent sm:text-7xl">2–4%</p>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-snug text-ink/85">
            of those same predictions cited evidence that semantically supported M0
          </p>
        </div>
      </div>
      <p className="mt-6 inline-block border-l border-accent pl-3 font-mono text-[11px] text-accent">
        Conditional on M0 predictions — not overall M-stage accuracy (25–48% by arm).
      </p>

      <div className="mt-10 grid gap-10 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <PanelLabel>Why the first number is easy</PanelLabel>
          <div aria-hidden className="mt-4 grid w-fit grid-cols-[repeat(20,10px)] gap-[3px]">
            {Array.from({ length: 100 }, (_, i) => (
              <span key={i} className={cn("size-[10px] rounded-[1px]", i < 95 ? "bg-connection" : "bg-accent")} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            Gold M labels in the eligible pool were <span className="text-ink">94.7% M0</span> and 5.3%{" "}
            <span className="text-accent">M1</span>. Predicting M0 is right most of the time before reading a word of the
            report.
          </p>
        </div>

        <div>
          <PanelLabel>M0 predictions, by arm</PanelLabel>
          <table className="mt-4 w-full border-collapse font-mono text-[12px]">
            <caption className="sr-only">M0 predictions per arm with label accuracy and semantic-support rate.</caption>
            <thead>
              <tr className="text-secondary">
                {["Arm", "M0 calls", "Accuracy", "Supported"].map((h) => (
                  <th key={h} scope="col" className="border-b border-border pb-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m0.map((r) => (
                <tr key={r.arm}>
                  <th scope="row" className="border-b border-border py-2 text-left font-normal text-ink">
                    {r.arm}
                  </th>
                  <td className="border-b border-border py-2 text-secondary">{r.n}</td>
                  <td className="border-b border-border py-2 text-ink">{r.accuracy.toFixed(1)}%</td>
                  <td className="border-b border-border py-2 text-accent">{r.supported.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- paired deltas */

const deltas = [
  {
    step: "C → C+",
    label: "add explicit abstention",
    rows: [
      { metric: "Accuracy", diff: -7.27, lo: -8.4, hi: -6.17 },
      { metric: "Semantic-unsupported rate (lower is better)", diff: -7.7, lo: -9.3, hi: -6.17 },
      { metric: "Semantic-supported accuracy", diff: -2.27, lo: -3.3, hi: -1.23 },
      { metric: "Coverage", diff: -11.73, lo: -12.93, hi: -10.53 },
    ],
  },
  {
    step: "C+ → D",
    label: "add mandatory evidence",
    rows: [
      { metric: "Accuracy", diff: -0.63, lo: -1.57, hi: 0.27 },
      { metric: "Semantic-unsupported rate (lower is better)", diff: -3.53, lo: -4.97, hi: -2.13 },
      { metric: "Semantic-supported accuracy", diff: 3.63, lo: 2.53, hi: 4.7 },
      { metric: "Coverage", diff: 2.53, lo: 1.53, hi: 3.53 },
    ],
  },
];

const RANGE = 14; // percentage points shown either side of zero
const pos = (v: number) => `${50 + (v / RANGE) * 50}%`;

export function PairedDeltas() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
      {deltas.map((d, i) => (
        <section key={d.step} className={cn(i === 0 ? "lg:border-r lg:border-border lg:pr-8" : "lg:pl-8")}>
          <PanelLabel className={i === 1 ? "text-accent" : undefined}>
            {d.step} &middot; {d.label}
          </PanelLabel>
          <ul className="mt-4 space-y-4">
            {d.rows.map((r) => {
              const crosses = r.lo < 0 && r.hi > 0;
              return (
                <li key={r.metric}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-ink/85">{r.metric}</span>
                    <span className={cn("font-mono text-[12px]", crosses ? "text-secondary" : "text-ink")}>
                      {r.diff > 0 ? "+" : "−"}
                      {Math.abs(r.diff).toFixed(2)} pts
                      <span className="text-secondary">
                        {" "}
                        [{r.lo.toFixed(2)}, {r.hi.toFixed(2)}]
                      </span>
                    </span>
                  </div>
                  <div aria-hidden className="relative mt-2 h-3">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                    <span className="absolute top-0 bottom-0 left-1/2 w-px bg-secondary/60" />
                    <span
                      className={cn("absolute top-1/2 h-[3px] -translate-y-1/2", crosses ? "bg-secondary/50" : "bg-accent/50")}
                      style={{ left: pos(r.lo), width: `calc(${pos(r.hi)} - ${pos(r.lo)})` }}
                    />
                    <span
                      className={cn(
                        "absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-canvas",
                        crosses ? "border-secondary" : "border-accent",
                      )}
                      style={{ left: pos(r.diff) }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- BB-TEN */

const bbten = [
  { system: "A · zero-shot", acc: 46.3, bal: 0.48, m1: 50.0 },
  { system: "C · constrained", acc: 53.1, bal: 0.555, m1: 58.3 },
  { system: "C+ · + unknown", acc: 30.9, bal: 0.435, m1: 58.3 },
  { system: "D · grounded", acc: 26.5, bal: 0.412, m1: 58.3 },
  { system: "BB-TEN", acc: 90.7, bal: 0.528, m1: 8.3, external: true },
];

export function BbtenComparison() {
  return (
    <div>
      <PanelLabel>M stage &middot; leak-free overlap &middot; n = 162 (150 M0, 12 M1)</PanelLabel>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <caption className="sr-only">M-stage comparison between StageGround arms and the BB-TEN supervised baseline.</caption>
          <thead>
            <tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">
              {["System", "Accuracy", "Balanced acc.", "M1 recall"].map((h) => (
                <th key={h} scope="col" className="border-b border-border pr-4 pb-2 text-left font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-[12px]">
            {bbten.map((r) => (
              <tr key={r.system} className={r.external ? "text-ink" : "text-ink/80"}>
                <th scope="row" className={cn("border-b border-border py-2.5 pr-4 text-left font-normal", r.external && "text-accent")}>
                  {r.system}
                </th>
                <td className={cn("border-b border-border py-2.5 pr-4", r.external && "font-medium")}>{r.acc.toFixed(1)}%</td>
                <td className="border-b border-border py-2.5 pr-4">{r.bal.toFixed(3)}</td>
                <td className={cn("border-b border-border py-2.5", r.external && "text-accent")}>{r.m1.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-secondary">
        On T (n = 143) and N (n = 145), BB-TEN and the prompting arms were statistically indistinguishable on accuracy.
        BB-TEN emits no evidence, so it can be compared on labels only, never on grounding.
      </p>
    </div>
  );
}

/* --------------------------------------------------------- research pipeline */

export function ResearchPipeline() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Run"
        steps={[
          { label: "Build & canonicalize", note: "9,523 reports" },
          { label: "Stratified sample", note: "seed 42, n = 1,000" },
          { label: "Four arms", tone: "accent", note: "checkpointed, resumable" },
          { label: "predictions.jsonl", note: "raw output kept" },
        ]}
      />
      <Pipeline
        label="Analyse"
        steps={[
          { label: "Span check", note: "OCR-tolerant" },
          { label: "Semantic support", note: "separate field" },
          { label: "Metrics & errors" },
          { label: "Paired bootstrap", tone: "accent", note: "5,000 resamples" },
          { label: "Audit & replay" },
        ]}
      />
    </div>
  );
}
