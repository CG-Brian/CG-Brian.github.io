/**
 * Figures for the Cirqloom case study. Numbers come from the committed measured bundle
 * (data/bundles/gpt2-small, gpt2-small:v2) and the IOI annotations it imports from
 * Wang et al. (2022). Layout descriptions follow docs/ui-guidelines.md.
 */
import { cn } from "@/lib/cn";
import { Chip, PanelLabel, Pipeline } from "./diagram-primitives";

/* ------------------------------------------------------ interface schematic */

export function InterfaceSchematic() {
  const box = "rounded-[3px] border border-border bg-canvas p-3";
  const label = "font-mono text-[10px] uppercase tracking-[0.06em] text-secondary";
  return (
    <div>
      <div className={cn(box, "py-2")}>
        <p className={label}>Top bar &middot; bundle &middot; experiment picker</p>
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-[0.75fr_2fr_1.1fr]">
        <div className={box}>
          <p className={label}>Circuit sidebar</p>
          <ul className="mt-2 space-y-1 text-xs text-ink/80">
            <li>Circuits and their 7 roles</li>
            <li>Relations list (keyboard path to every ribbon)</li>
            <li>Head list, 12 &times; 12, arrow keys</li>
          </ul>
        </div>
        <div className={cn(box, "min-h-[180px]")}>
          <p className={label}>3D scene</p>
          <ul className="mt-2 space-y-1 text-xs text-ink/80">
            <li>12 layer frames &times; 12 heads, orbit &middot; pan &middot; zoom &middot; reset</li>
            <li>Role rings on circuit members; non-members recede</li>
            <li>Role-group hubs above the layers, 8 evidence-typed ribbons with Q / K / V / logits labels</li>
          </ul>
        </div>
        <div className={box}>
          <p className={label}>Inspector</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-ink/80 marker:text-secondary">
            <li>Identity</li>
            <li>Circuit membership</li>
            <li>Published annotations</li>
            <li>Measured observations</li>
            <li>Attention heatmap + mask</li>
            <li>What this does not show</li>
          </ol>
        </div>
      </div>
      <div className={cn(box, "mt-2 py-2")}>
        <p className={label}>Status bar</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------- two sources, one bundle */

export function EvidenceSources() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.8fr)] lg:items-center lg:gap-6">
      <div className="space-y-6">
        <div className="border-l-2 border-ink/60 pl-4">
          <PanelLabel className="text-ink">Measured here</PanelLabel>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            GPT-2 Small (pinned revision) &rarr; attention capture &rarr; prompt suites &amp; controls &rarr; detectors
            &rarr; observations and exact masks
          </p>
          <p className="mt-1 font-mono text-[11px] text-secondary">status: experimental &middot; 2,592 observations</p>
        </div>
        <div className="border-l-2 border-dashed border-accent pl-4">
          <PanelLabel className="text-accent">Published, imported</PanelLabel>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            Wang et al. (2022) &rarr; reviewed annotations &rarr; memberships &amp; evidence-typed relations with locators
          </p>
          <p className="mt-1 font-mono text-[11px] text-secondary">status: published &middot; 26 heads, 7 roles, 27 relations</p>
        </div>
      </div>
      <span aria-hidden className="hidden font-mono text-secondary lg:block">&rarr;</span>
      <div className="space-y-3">
        <Chip>Validated, versioned bundle</Chip>
        <p className="text-xs leading-relaxed text-secondary">
          Pydantic &harr; Zod contract, referential checks, masks, no NaN, shapes, float16 attention assets
        </p>
        <span aria-hidden className="block font-mono text-secondary">&darr;</span>
        <Chip tone="accent">Interactive explorer</Chip>
        <p className="text-xs leading-relaxed text-secondary">Two sources, never merged: each claim keeps its kind and status.</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- research pipeline */

export function CirqloomPipeline() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Analysis"
        steps={[
          { label: "Model adapter", note: "TransformerBridge, pinned" },
          { label: "Prompt suites", note: "deterministic seeds" },
          { label: "Attention capture", note: "[layer, head, q, k]" },
          { label: "Detectors", tone: "accent", note: "masks + scores" },
          { label: "Bundle export", note: "validated, byte-identical" },
        ]}
      />
      <Pipeline
        label="Explorer"
        steps={[
          { label: "Zod-validated load" },
          { label: "Zustand selection" },
          { label: "3D scene" },
          { label: "Inspector & heatmap", tone: "accent", note: "lazy float16 slice" },
        ]}
      />
    </div>
  );
}

/* --------------------------------------------------- repeated vs control */

const control = [
  { head: "L5H5", detector: "induction", measured: 0.94, control: 0.002 },
  { head: "L6H9", detector: "induction", measured: 0.918, control: 0.002 },
  { head: "L7H10", detector: "induction", measured: 0.911, control: 0.002 },
  { head: "L5H1", detector: "induction", measured: 0.911, control: 0.0 },
  { head: "L7H2", detector: "induction", measured: 0.836, control: 0.003 },
  { head: "L4H11", detector: "previous token", measured: 0.99, control: 0.987 },
  { head: "L5H7", detector: "first token", measured: 0.928, control: 0.932 },
];

export function RepeatedVsControl() {
  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-secondary">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2 w-4 bg-accent" /> repeated (BOS, X, X)
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2 w-4 bg-secondary/50" /> control (BOS, X, Y)
        </span>
      </div>
      <ul className="mt-5 space-y-4">
        {control.map((r, i) => (
          <li
            key={r.head}
            className={cn("grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6", i === 5 && "border-t border-border pt-4")}
          >
            <p className="flex items-baseline gap-2">
              <span className="font-mono text-[13px] text-ink">{r.head}</span>
              <span className="text-xs text-secondary">{r.detector}</span>
            </p>
            <div className="space-y-1">
              {[
                { v: r.measured, tone: "bg-accent", name: "repeated" },
                { v: r.control, tone: "bg-secondary/50", name: "control" },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <span className="h-2 flex-1 bg-border/60">
                    <span className={cn("block h-full", b.tone)} style={{ width: `${b.v * 100}%` }} />
                  </span>
                  <span className="w-12 text-right font-mono text-[12px] text-ink">
                    {b.v.toFixed(3)}
                    <span className="sr-only"> {b.name}</span>
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 font-mono text-[11px] leading-relaxed text-secondary">
        Sequence length 50, 8 prompts each. Median over all 144 heads for induction: 0.005 repeated, 0.001 control.
      </p>
    </div>
  );
}

/* ------------------------------------------------------ evidence statuses */

const statuses = [
  { name: "Published", border: "border-accent/60 text-accent", meaning: "Imported from a cited source. Not reproduced here." },
  { name: "Measured", border: "border-ink/40 text-ink", meaning: "Reserved for observations that meet the project’s measurement and validation criteria." },
  { name: "Experimental", border: "border-dashed border-secondary text-secondary", meaning: "A heuristic attention measurement. Every current score has this status." },
  { name: "Candidate", border: "border-dashed border-border text-secondary", meaning: "Suggested by a threshold or selection rule. Not causally verified." },
  { name: "Unavailable", border: "border-dotted border-border text-secondary", meaning: "No reliable evidence. Shown as missing, never as zero." },
];

export function EvidenceStatuses() {
  return (
    <ul className="border-t border-border">
      {statuses.map((s) => (
        <li key={s.name} className="grid gap-2 border-b border-border py-3 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
          <span className={cn("w-fit rounded-[3px] border px-2 py-0.5 font-mono text-[11px]", s.border)}>{s.name}</span>
          <span className="text-sm leading-relaxed text-ink/85">{s.meaning}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------- granularity: the centrepiece */

const senders = ["L7H3", "L7H9", "L8H6", "L8H10"];
const receivers = ["L9H9", "L9H6", "L10H0"];

function SenderColumn({ x }: { x: number }) {
  return (
    <>
      {senders.map((s, i) => (
        <g key={s}>
          <rect x={x - 34} y={28 + i * 44} width={68} height={26} rx={3} className="fill-canvas stroke-border" />
          <text x={x} y={45 + i * 44} textAnchor="middle" className="fill-ink font-mono text-[11px]">
            {s}
          </text>
        </g>
      ))}
    </>
  );
}

export function GranularityComparison() {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
        <section className="lg:border-r lg:border-border lg:pr-8">
          <PanelLabel>Naive &middot; expanded into head pairs</PanelLabel>
          <svg viewBox="0 0 320 210" className="mt-4 w-full max-w-[420px]" role="img" aria-label="Four sender heads each drawn to three receiver heads: twelve head-to-head edges.">
            {senders.flatMap((_, i) =>
              receivers.map((_, j) => (
                <line key={`${i}-${j}`} x1={92} y1={41 + i * 44} x2={232} y2={63 + j * 44} className="stroke-secondary/60" strokeWidth={1} />
              )),
            )}
            <SenderColumn x={58} />
            {receivers.map((r, j) => (
              <g key={r}>
                <rect x={232} y={50 + j * 44} width={68} height={26} rx={3} className="fill-canvas stroke-border" />
                <text x={266} y={67 + j * 44} textAnchor="middle" className="fill-ink font-mono text-[11px]">
                  {r}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            12 tidy edges, each implying a pair-level result. The paper measured none of them.
          </p>
        </section>

        <section className="lg:pl-8">
          <PanelLabel className="text-accent">Evidence-preserving &middot; head &rarr; role group</PanelLabel>
          <svg viewBox="0 0 320 210" className="mt-4 w-full max-w-[420px]" role="img" aria-label="Four sender heads each drawn to one Name Mover role-group hub through the query channel: four edges.">
            {senders.map((_, i) => (
              <path
                key={i}
                d={`M 92 ${41 + i * 44} C 156 ${41 + i * 44}, 164 106, 206 106`}
                fill="none"
                className="stroke-accent"
                strokeWidth={1.25}
              />
            ))}
            <SenderColumn x={58} />
            <rect x={206} y={78} width={110} height={56} rx={3} className="fill-canvas stroke-accent" />
            <text x={261} y={98} textAnchor="middle" className="fill-accent font-mono text-[10px]">
              Name Mover
            </text>
            <text x={261} y={112} textAnchor="middle" className="fill-accent font-mono text-[10px]">
              group
            </text>
            <text x={261} y={126} textAnchor="middle" className="fill-secondary font-mono text-[9px]">
              L9H9 · L9H6 · L10H0
            </text>
            <text x={160} y={200} textAnchor="middle" className="fill-secondary font-mono text-[10px]">
              channel Q · END → END · §3.2, Fig. 4b
            </text>
          </svg>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            4 records, as measured: each S-Inhibition head patched into the whole receiving group.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t border-border pt-5">
        <PanelLabel>All 27 IOI relations, by stored granularity</PanelLabel>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["head → role group", "13"],
            ["role group → group", "1"],
            ["head → logits", "13"],
            ["head → head", "0"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[11px] text-secondary">{k}</dt>
              <dd className={cn("mt-1 text-2xl font-medium tracking-[-0.02em]", v === "0" ? "text-secondary" : "text-ink")}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- tests */

const suites = [
  { figure: "222", what: "Python test functions across 16 files", note: "Detectors, masks, scoring, suites, schema, bundle, adapter contract." },
  { figure: "110", what: "frontend unit tests across 11 files", note: "Loading, store, selectors, inspector and heatmap logic." },
  { figure: "10", what: "Playwright browser tests", note: "Core interactions in a real browser." },
];

export function TestSuites() {
  return (
    <div>
      <ul className="border-t border-border">
        {suites.map((s) => (
          <li key={s.what} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[6rem_1fr] sm:gap-6">
            <span className="text-3xl font-medium tracking-[-0.03em] text-ink">{s.figure}</span>
            <span>
              <span className="block text-[17px] leading-snug text-ink/85">{s.what}</span>
              <span className="mt-1 block font-mono text-[11px] text-secondary">{s.note}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] leading-relaxed text-secondary">
        Counted in the source at the time of writing, not run for this page. The Python count includes opt-in real-model tests, which are skipped by default.
      </p>
    </div>
  );
}
