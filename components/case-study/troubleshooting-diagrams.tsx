/**
 * Diagrams for the Industrial AI Troubleshooting Platform case study.
 * Every equipment name, query, document, score and procedure here is synthetic.
 */
import { cn } from "@/lib/cn";
import { Chip, Edge, PanelLabel, Pipeline } from "./diagram-primitives";

/* ------------------------------------------------------- hybrid architecture */

function Lane({
  kicker,
  title,
  tag,
  items,
  accent,
  children,
}: {
  kicker: string;
  title: string;
  tag?: string;
  items: string[];
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("border-t pt-4", accent ? "border-accent/60" : "border-border")}>
      <PanelLabel className={accent ? "text-accent" : undefined}>{kicker}</PanelLabel>
      <p className="mt-2 text-[15px] font-medium tracking-[-0.01em]">
        {title}
        {tag && <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.06em] text-accent">{tag}</span>}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i}>
            <Chip className="py-0.5 text-[11px]">{i}</Chip>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

export function HybridArchitecture() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-y-2">
        <Chip>Technician</Chip>
        <span className="w-10 sm:w-16">
          <Edge />
        </span>
        <Chip>Application interface</Chip>
        <p className="mt-1 w-full font-mono text-[10px] text-secondary sm:mt-0 sm:ml-4 sm:w-auto">
          chat &middot; guided sessions &middot; streaming &middot; review
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:gap-4">
        <Lane
          accent
          kicker="Probabilistic · conversation path"
          title="AI agent & backend"
          tag="my focus"
          items={["Agent orchestration", "RAG answers", "Tool calls", "Report generation", "Content extraction", "Tree enrichment", "Guardrails", "Output validation"]}
        >
          <div className="mt-5 ml-3 border-l border-connection pt-1 pl-4">
            <p className="text-sm font-medium">Retrieval &amp; operational data</p>
            <p className="mt-1 text-sm leading-relaxed text-secondary">Document search, maintenance history, source metadata.</p>
          </div>
        </Lane>

        <div className="flex items-center lg:pt-14">
          <span className="font-mono text-[10px] text-secondary lg:hidden">&darr; builds &amp; enriches diagnostic trees</span>
          <span className="hidden w-full lg:block">
            <Edge label="builds trees" tone="muted" />
          </span>
        </div>

        <Lane
          kicker="Deterministic · guided path"
          title="Guided workflow service"
          items={["Stores decision trees", "Serves sessions", "Tracks state", "Step navigation", "Diagnostic artifacts"]}
        >
          <p className="mt-5 text-sm leading-relaxed text-secondary">
            At runtime, the next step comes from the tree, not from a model deciding on the spot.
          </p>
        </Lane>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- generic trade-off */

type Side = { title: string; pros: string[]; cons: string[] };

/** Two options side by side, with the one we chose marked. */
export function Tradeoff({ left, right, chosen = "left" }: { left: Side; right: Side; chosen?: "left" | "right" }) {
  return (
    <div className="my-10 grid gap-8 border-y border-border py-6 sm:grid-cols-2 sm:gap-10">
      {([left, right] as const).map((side, i) => {
        const isChosen = (i === 0) === (chosen === "left");
        return (
          <div key={side.title}>
            <p className={cn("font-mono text-[11px] uppercase tracking-[0.06em]", isChosen ? "text-accent" : "text-secondary")}>
              {isChosen ? "Chosen" : "Considered"}
            </p>
            <p className="mt-1 text-base font-medium">{side.title}</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
              {side.pros.map((p) => (
                <li key={p} className="text-ink/85">
                  <span aria-hidden className="mr-2 font-mono text-accent">+</span>
                  <span className="sr-only">Advantage: </span>
                  {p}
                </li>
              ))}
              {side.cons.map((c) => (
                <li key={c} className="text-secondary">
                  <span aria-hidden className="mr-2 font-mono">&minus;</span>
                  <span className="sr-only">Limitation: </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------- root-cause priorities */

const causes = [
  { name: "Worn pump seal", likelihood: "high", diagnose: "easy", fix: "moderate", share: 50 },
  { name: "Clogged inlet filter", likelihood: "medium", diagnose: "easy", fix: "easy", share: 30 },
  { name: "Drifting pressure sensor", likelihood: "medium", diagnose: "hard", fix: null, share: 20 },
];

export function PriorityDistribution() {
  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,1.2fr)] gap-6 border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary sm:grid">
        <span>Possible cause</span>
        <span>Expert signals</span>
        <span>Priority</span>
      </div>
      <ul>
        {causes.map((c, i) => (
          <li key={c.name} className="grid gap-3 border-b border-border py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center sm:gap-6">
            <p className="text-[15px] font-medium">{c.name}</p>
            <dl className="grid grid-cols-3 gap-2 font-mono text-[11px]">
              {[
                ["likely", c.likelihood],
                ["diagnose", c.diagnose],
                ["fix", c.fix],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-secondary">{k}</dt>
                  <dd className={v ? "text-ink" : "text-secondary"}>{v ?? "— default"}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-3">
              <span className="h-2 flex-1 bg-border/60">
                <span
                  className={cn("block h-full", i === 0 ? "bg-accent" : "bg-accent/45")}
                  style={{ width: `${c.share * 2}%` }}
                />
              </span>
              <span className="w-10 text-right font-mono text-[12px] text-ink">{c.share}%</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] leading-relaxed text-secondary">
        Shares sum to 100%. A missing input gets a default at calculation time; the stored data stays empty. Same inputs,
        same ranking, every time.
      </p>
    </div>
  );
}

/* --------------------------------------------------- guidance readability */

export function GuidanceBeforeAfter() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
      <section className="lg:border-r lg:border-border lg:pr-8">
        <PanelLabel>Before &middot; technically relevant</PanelLabel>
        <p className="mt-4 text-[13px] leading-relaxed text-secondary">
          To address low discharge pressure on the circulation pump, first make sure the unit has been isolated and that
          you have reviewed the service manual (rev. 4.2, section 7.3.1, document ID DOC-0000, last updated 2019), then
          check the inlet filter and if it is clogged clean or replace it, noting that the pump must never be run dry as
          this may damage the seal, and if the filter is clean proceed to inspect the impeller for wear, which is often
          caused by cavitation, a phenomenon in which vapour bubbles form when local pressure drops below&hellip;
        </p>
      </section>

      <section className="lg:pl-8">
        <PanelLabel>After &middot; operationally usable</PanelLabel>
        <dl className="mt-4 space-y-4 text-[13px] leading-relaxed">
          <div>
            <dt className="font-mono text-[11px] text-secondary">Preparation</dt>
            <dd className="mt-1 text-ink/85">Isolate the unit and lock out power.</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-secondary">Steps</dt>
            <dd className="mt-1 text-ink/85">
              <ol className="list-decimal space-y-0.5 pl-5 marker:text-secondary">
                <li>Inspect the inlet filter.</li>
                <li>Measure discharge pressure at idle.</li>
              </ol>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-secondary">Conditions</dt>
            <dd className="mt-1 space-y-0.5 text-ink/85">
              <p>
                <span className="font-mono text-[11px] text-accent">if clogged</span> &rarr; clean or replace, then re-test.
              </p>
              <p>
                <span className="font-mono text-[11px] text-accent">if clean</span> &rarr; inspect the impeller.
              </p>
            </dd>
          </div>
          <div className="border-l border-accent pl-3">
            <dt className="font-mono text-[11px] text-accent">Warning</dt>
            <dd className="mt-1 text-ink">Never run the pump dry; it damages the seal.</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-secondary">References</dt>
            <dd className="mt-1 text-secondary">Service manual &sect;7, pump maintenance.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/* ------------------------------------------------------- retrieval debugging */

const retrieval = [
  {
    label: "Before",
    query: "Verdacht auf Förderdruckabfall durch Laufradverschleiß; Pumpe demontiert, geprüft und Laufrad ausgetauscht",
    gloss: "A long German cause-and-action narrative",
    results: ["Site safety orientation", "Pressure terminology glossary", "Maintenance log template"],
    relevant: false,
    parts: [] as string[],
  },
  {
    label: "After",
    query: "circulation pump impeller · replacement part",
    gloss: "Component-focused, in the documents’ language, plus source chunks from earlier steps",
    results: ["Pump service manual · impeller assembly", "Spare parts catalogue · pump wet end", "Torque table · pump housing"],
    relevant: true,
    parts: ["Impeller kit", "Shaft seal", "Torque wrench"],
  },
];

export function RetrievalDebug() {
  return (
    <div>
      <div className="space-y-8">
        {retrieval.map((r) => (
          <div key={r.label} className="grid gap-4 lg:grid-cols-[6rem_minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-6">
            <PanelLabel className={cn("lg:pt-1", r.relevant && "text-accent")}>{r.label}</PanelLabel>
            <div>
              <p className="font-mono text-[10px] text-secondary">Query</p>
              <p lang={r.relevant ? "en" : "de"} className={cn("mt-1 rounded-[3px] border px-3 py-2 text-[13px] leading-relaxed", r.relevant ? "border-accent/50 font-mono text-[12px] text-accent" : "border-border text-ink")}>
                {r.query}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-secondary">{r.gloss}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-secondary">Top 3 results</p>
              <ol className="mt-1 space-y-1">
                {r.results.map((d) => (
                  <li key={d} className="flex items-baseline gap-2 text-[13px]">
                    <span aria-hidden className={cn("font-mono text-[11px]", r.relevant ? "text-accent" : "text-secondary")}>
                      {r.relevant ? "✓" : "✕"}
                    </span>
                    <span className={r.relevant ? "text-ink" : "text-secondary"}>{d}</span>
                    <span className="sr-only">{r.relevant ? "(relevant)" : "(not relevant)"}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="font-mono text-[10px] text-secondary">Extracted</p>
              {r.parts.length ? (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {r.parts.map((p) => (
                    <li key={p}>
                      <Chip className="py-0.5 text-[11px]">{p}</Chip>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 font-mono text-[12px] text-secondary">no parts found</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-5">
        <PanelLabel>One validation example &middot; nine possible causes</PanelLabel>
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          {[
            ["Causes with no parts", "5/9", "3/9"],
            ["Parts entries", "10", "16"],
            ["Tools entries", "17", "19"],
          ].map(([k, a, b]) => (
            <div key={k}>
              <dt className="text-sm text-secondary">{k}</dt>
              <dd className="mt-1 font-mono text-lg text-ink">
                {a} <span className="text-secondary">&rarr;</span> <span className="text-accent">{b}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* --------------------------------------------------- image filter placement */

function Knows({ known, missing }: { known: string[]; missing?: string }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 lg:ml-[7rem]">
      <span className="mr-1 font-mono text-[10px] text-secondary">filter can see</span>
      {known.map((k) => (
        <Chip key={k} className="py-0 text-[11px]">
          {k}
        </Chip>
      ))}
      {missing && (
        <Chip tone="muted" className="py-0 text-[11px] line-through">
          <span className="sr-only">not available: </span>
          {missing}
        </Chip>
      )}
    </div>
  );
}

export function ImageFilterPlacement() {
  return (
    <div className="space-y-10">
      <div>
        <Pipeline
          label="First try"
          steps={[{ label: "Retrieve" }, { label: "Filter images", tone: "accent", note: "guessing" }, { label: "Generate answer" }]}
        />
        <Knows known={["question", "documents", "candidate images"]} missing="the answer" />
      </div>
      <div>
        <Pipeline
          label="Revised"
          steps={[{ label: "Retrieve" }, { label: "Generate answer" }, { label: "Filter images", tone: "accent", note: "fail-open" }]}
        />
        <Knows known={["question", "the answer", "candidate images"]} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ graph ordering */

type GEdge = { from: string; to: string; kind: "primary" | "alternative" };

const immediate: GEdge[] = [
  { from: "Step 1", to: "Alt A", kind: "alternative" },
  { from: "Step 1", to: "Step 2", kind: "primary" },
  { from: "Step 2", to: "Alt B", kind: "alternative" },
  { from: "Step 2", to: "Step 3", kind: "primary" },
];

const twoPass: GEdge[] = [
  { from: "Step 1", to: "Step 2", kind: "primary" },
  { from: "Step 2", to: "Step 3", kind: "primary" },
  { from: "Step 1", to: "Alt A", kind: "alternative" },
  { from: "Step 2", to: "Alt B", kind: "alternative" },
];

function EdgeList({ edges, passes }: { edges: GEdge[]; passes?: boolean }) {
  return (
    <ol className="mt-4 space-y-2">
      {edges.map((e, i) => (
        <li key={`${e.from}-${e.to}`}>
          {passes && (i === 0 || i === 2) && (
            <p className={cn("mb-1 font-mono text-[10px] text-secondary", i === 2 && "mt-3")}>
              {i === 0 ? "pass 1 · primary chain" : "pass 2 · deferred alternatives"}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="w-4 shrink-0 font-mono text-[10px] text-secondary">{i + 1}</span>
            <Chip className="py-0 text-[11px]">{e.from}</Chip>
            <Edge label={e.kind} tone={e.kind === "primary" ? "accent" : "muted"} />
            <Chip tone={e.kind === "primary" ? "default" : "muted"} className="py-0 text-[11px]">
              {e.to}
            </Chip>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Choices({ first, second, wrong }: { first: string; second: string; wrong?: boolean }) {
  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="font-mono text-[10px] text-secondary">What the technician sees at Step 1</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[first, second].map((c, i) => (
          <span
            key={c}
            className={cn(
              "rounded-[3px] border px-3 py-1.5 text-[13px]",
              i === 0 ? (wrong ? "border-ink/40 text-ink" : "border-accent/60 text-accent") : "border-border text-secondary",
            )}
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-secondary">
        {wrong ? "Valid graph. Wrong first choice." : "The primary path leads, as the interface expects."}
      </p>
    </div>
  );
}

export function GraphOrdering() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
      <section className="lg:border-r lg:border-border lg:pr-8">
        <PanelLabel>Before &middot; insert as you go</PanelLabel>
        <EdgeList edges={immediate} />
        <Choices first="Alternative" second="Primary" wrong />
      </section>
      <section className="lg:pl-8">
        <PanelLabel className="text-accent">After &middot; two passes</PanelLabel>
        <EdgeList edges={twoPass} passes />
        <Choices first="Primary" second="Alternative" />
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- CI and tests */

export function CIBeforeAfter() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Before"
        steps={[{ label: "Feature branch" }, { label: "Validation", tone: "muted", note: "inconsistent" }, { label: "Merge" }]}
      />
      <Pipeline
        label="After"
        steps={[
          { label: "Feature branch" },
          { label: "Lint & types" },
          { label: "Deterministic tests", tone: "accent", note: "unit, self-contained" },
          { label: "Published results" },
          { label: "Review" },
        ]}
      />
      <Pipeline
        label="Separately"
        steps={[
          { label: "Integration tests", tone: "muted", note: "explicitly marked" },
          { label: "LLM evaluations", tone: "muted", note: "cost, latency, nondeterminism" },
          { label: "Run deliberately" },
        ]}
      />
    </div>
  );
}

/* ----------------------------------------------------------- failure domains */

const domains = [
  { layer: "Model behavior", examples: "Guardrails, response structure, image relevance", not: "more unit tests" },
  { layer: "Evidence quality", examples: "Query language, query focus, grounding context", not: "a stronger generation model" },
  { layer: "Deterministic correctness", examples: "Edge ordering, root-cause scoring, schema contracts", not: "a better prompt" },
  { layer: "Product reliability", examples: "Workflow separation, report inputs, fail-open extras", not: "a smarter model" },
  { layer: "Engineering reliability", examples: "Test boundaries, CI gates, release steps", not: "more tests in the wrong place" },
];

export function FailureDomains() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <caption className="sr-only">Failure domains seen in this project and what does not fix them.</caption>
        <thead>
          <tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">
            {["Layer", "Where it showed up", "Won’t be fixed by"].map((h) => (
              <th key={h} scope="col" className="border-b border-border pr-4 pb-2 text-left font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.layer} className="align-top">
              <th scope="row" className="border-b border-border py-3 pr-4 text-left font-medium">
                {d.layer}
              </th>
              <td className="border-b border-border py-3 pr-4 leading-relaxed text-ink/85">{d.examples}</td>
              <td className="border-b border-border py-3 font-mono text-[12px] text-secondary">{d.not}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------- qualified facts */

const facts = [
  { figure: "82", what: "labeled guardrail evaluation cases across 10 categories", note: "Used to tune behaviour. No final accuracy figure is claimed." },
  { figure: "2", what: "graph-ordering defects traced and fixed", note: "One root cause, found in two places in the tree builder." },
  { figure: "15+", what: "merged pull requests recorded in the agent repository", note: "Development activity, not a customer outcome." },
  { figure: "269", what: "passing unit tests at a recorded snapshot", note: "The repository’s whole suite, not tests I wrote alone." },
  { figure: "10 → 16", what: "extracted parts entries in one nine-cause example", note: "A small sample, not a benchmark or a recall metric." },
];

export function QualifiedFacts() {
  return (
    <ul className="my-10 border-t border-border">
      {facts.map((f) => (
        <li key={f.what} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
          <span className="text-3xl font-medium tracking-[-0.03em] text-ink">{f.figure}</span>
          <span>
            <span className="block text-[17px] leading-snug text-ink/85">{f.what}</span>
            <span className="mt-1 block font-mono text-[11px] text-secondary">{f.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
