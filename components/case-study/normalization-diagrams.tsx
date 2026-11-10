/**
 * Diagrams for the Industrial AI Normalization Engine case study.
 * Every name, value and cell here is synthetic and exists only for illustration.
 */
import { cn } from "@/lib/cn";
import { Chip, Edge, PanelLabel, Pipeline, type Step } from "./diagram-primitives";

/* ---------------------------------------------------------------- architecture */

const layers = [
  {
    name: "User interface",
    does: ["Upload a workbook", "Confirm parsing settings", "Review and correct results"],
  },
  {
    name: "Application backend",
    tag: "owns state",
    does: ["Users and workflow", "Files", "Job lifecycle and status", "Async orchestration", "Persistence", "Access control", "Review workflow"],
  },
  {
    name: "AI processing service",
    tag: "stateless",
    boundary: true,
    does: ["Reads a structured sheet representation", "Applies confirmed parsing settings", "Deterministic extraction", "LLM-assisted normalization", "Reference reconciliation", "Output validation"],
  },
  {
    name: "Domain normalization pipeline",
    tag: "my focus",
    focus: true,
    does: ["Domain-specific transformation and validation", "Independent of the product framework and the LLM provider"],
  },
];

export function ArchitectureDiagram() {
  return (
    <ol className="relative pl-7 before:absolute before:top-6 before:bottom-6 before:left-[3px] before:w-px before:bg-connection">
      {layers.map((l, i) => (
        <li
          key={l.name}
          className={cn(
            "relative py-5",
            i > 0 && "border-t",
            l.boundary ? "border-dashed border-accent/60" : "border-border",
          )}
        >
          {l.boundary && (
            <p className="absolute -top-2.5 right-0 bg-canvas pl-2 font-mono text-[10px] text-accent">
              stateless boundary &middot; state above, computation below
            </p>
          )}
          <span
            aria-hidden
            className={cn(
              "absolute top-[27px] -left-7 size-[7px] rounded-full border bg-canvas",
              l.focus ? "border-accent bg-accent" : "border-secondary",
            )}
          />
          <div className="grid gap-2 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <div>
              <p className="text-[15px] font-medium tracking-[-0.01em]">{l.name}</p>
              {l.tag && (
                <p className={cn("mt-1 font-mono text-[10px] uppercase tracking-[0.06em]", l.focus ? "text-accent" : "text-secondary")}>
                  {l.tag}
                </p>
              )}
            </div>
            <p className="text-sm leading-relaxed text-secondary">{l.does.join(" · ")}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------- naive vs. hybrid flow */

const naive: Step[] = [
  { label: "Raw spreadsheet" },
  { label: "LLM", note: "does everything", tone: "accent" },
  { label: "Structured output", note: "looks right?" },
];

const hybrid: Step[] = [
  { label: "Raw spreadsheet" },
  { label: "Configurable parser", note: "deterministic, user-confirmed" },
  { label: "LLM", note: "meaning only", tone: "accent" },
  { label: "Validator", note: "deterministic" },
  { label: "Structured output", note: "checked" },
];

export function PipelineComparison() {
  return (
    <div className="space-y-10">
      <Pipeline label="Naive" steps={naive} />
      <Pipeline label="Hybrid" steps={hybrid} />
    </div>
  );
}

/* ------------------------------------------------------------- matrix → graph */

const sources = ["Level switch", "Pressure sensor", "Manual button"];
const targets = ["Pump", "Alarm"];
const cells: (string | null)[][] = [
  ["stops when high", null],
  [null, "warns above 5 bar"],
  ["starts", "silences"],
];

export function MatrixToGraph() {
  const edges = cells.flatMap((row, r) => row.flatMap((v, c) => (v ? [{ from: sources[r], to: targets[c], label: v }] : [])));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
      <div>
        <PanelLabel>As the spreadsheet sees it</PanelLabel>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-[12px]">
            <caption className="sr-only">Synthetic relationship matrix: sources in rows, targets in columns.</caption>
            <thead>
              <tr>
                <td className="border-b border-border" />
                {targets.map((t) => (
                  <th key={t} scope="col" className="border-b border-l border-border px-3 py-2 text-left font-normal text-ink">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map((s, r) => (
                <tr key={s}>
                  <th scope="row" className="border-b border-border py-2 pr-3 text-left font-normal whitespace-nowrap text-ink">
                    {s}
                  </th>
                  {cells[r].map((v, c) => (
                    <td key={c} className={cn("border-b border-l border-border px-3 py-2", v ? "text-accent" : "text-secondary")}>
                      {v ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          Rows are sources, columns are targets, and the interesting part lives in the intersections.
        </p>
      </div>

      <div>
        <PanelLabel>As the pipeline models it</PanelLabel>
        <ul className="mt-4 space-y-3">
          {edges.map((e) => (
            <li key={`${e.from}-${e.to}`} className="flex items-center">
              <Chip>{e.from}</Chip>
              <Edge label={e.label} />
              <Chip>{e.to}</Chip>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          <span className="font-mono text-[12px] text-ink">Boxes</span> are entities.{" "}
          <span className="font-mono text-[12px] text-accent">Labels</span> are relationship attributes: they belong to
          the connection, not to either end of it.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- provenance */

const sheet = [
  { row: 15, cells: ["S-014", "Flow meter, inlet", "m³/h", "AI"] },
  { row: 16, cells: ["S-015", "Level switch, tank 2", "—", "DI"] },
  { row: 17, hidden: true },
  { row: 18, cells: ["S-017", "Door contact, panel 3", "—", "DIG"] },
  { row: 19, cells: ["S-018", "Pressure sensor, outlet", "bar", "AI"] },
] as const;

export function ProvenanceTrace() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
      <div>
        <PanelLabel>Sheet2 &middot; reference dataset</PanelLabel>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-[12px]">
            <caption className="sr-only">Synthetic reference sheet. Cell D18 holds the source value.</caption>
            <thead>
              <tr className="text-secondary">
                <td className="w-8 border-b border-border" />
                {["A", "B", "C", "D"].map((c) => (
                  <th key={c} scope="col" className="border-b border-l border-border px-2.5 py-1.5 text-left font-normal">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.map((r) =>
                "hidden" in r ? (
                  <tr key={r.row}>
                    <th scope="row" className="border-b border-border py-1 pr-2 text-left font-normal text-secondary">
                      {r.row}
                    </th>
                    <td colSpan={4} className="border-b border-l border-dashed border-border px-2.5 py-1 text-[10px] text-secondary">
                      hidden row: skipped, but still counted
                    </td>
                  </tr>
                ) : (
                  <tr key={r.row}>
                    <th scope="row" className="border-b border-border py-1.5 pr-2 text-left font-normal text-secondary">
                      {r.row}
                    </th>
                    {r.cells.map((v, c) => {
                      const hit = r.row === 18 && c === 3;
                      return (
                        <td
                          key={c}
                          className={cn(
                            "border-b border-l border-border px-2.5 py-1.5 whitespace-nowrap",
                            hit ? "bg-accent/10 text-accent outline outline-accent/60 -outline-offset-1" : "text-ink",
                          )}
                        >
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <PanelLabel>Normalized field</PanelLabel>
        <pre className="mt-4 overflow-x-auto rounded-[3px] border border-border px-4 py-3 font-mono text-[12px] leading-[1.7] text-secondary">
          <code>
            {"{\n"}
            {"  "}<span className="text-ink">&quot;attribute&quot;</span>: &quot;signal_type&quot;,{"\n"}
            {"  "}<span className="text-ink">&quot;value&quot;</span>: <span className="text-ink">&quot;digital&quot;</span>,{"\n"}
            {"  "}<span className="text-ink">&quot;provenance&quot;</span>: {"{\n"}
            {"    "}<span className="text-ink">&quot;source&quot;</span>: &quot;reference_dataset&quot;,{"\n"}
            {"    "}<span className="text-ink">&quot;location&quot;</span>: <span className="text-accent">&quot;Sheet2!D18&quot;</span>{"\n"}
            {"  }\n}"}
          </code>
        </pre>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          <span className="font-mono text-[12px] text-accent">DIG</span> becomes{" "}
          <span className="font-mono text-[12px] text-ink">digital</span>, and the answer keeps a note of where it came
          from. Row 18 is still row 18 because the hidden row was never renumbered away.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- reconciliation */

const conflicts = [
  {
    field: "signal_type",
    sheet: "DI",
    reference: "digital",
    kept: "digital",
    why: "The reference is authoritative for signal metadata.",
    review: false,
  },
  {
    field: "description",
    sheet: "temp sens 1",
    reference: "Temperature sensor, north",
    kept: "Temperature sensor, north",
    why: "Reference wins, but the spreadsheet’s version is kept for review.",
    review: true,
  },
  {
    field: "trip condition",
    sheet: "above 80 °C",
    reference: "—",
    kept: "above 80 °C",
    why: "It describes a relationship, so reference data doesn’t get a vote.",
    review: false,
  },
];

export function ReconciliationTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">A synthetic reconciliation policy between a spreadsheet and a reference dataset.</caption>
        <thead>
          <tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">
            {["Field", "Spreadsheet", "Reference", "Kept", "Because"].map((h) => (
              <th key={h} scope="col" className="border-b border-border pr-4 pb-2 text-left font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conflicts.map((c) => (
            <tr key={c.field} className="align-top">
              <th scope="row" className="border-b border-border py-3 pr-4 text-left font-mono text-[12px] font-normal text-ink">
                {c.field}
              </th>
              <td className="border-b border-border py-3 pr-4 font-mono text-[12px] text-secondary">{c.sheet}</td>
              <td className="border-b border-border py-3 pr-4 font-mono text-[12px] text-secondary">{c.reference}</td>
              <td className="border-b border-border py-3 pr-4 font-mono text-[12px] text-accent">
                {c.kept}
                {c.review && <span className="mt-1 block text-[10px] text-secondary">+ alternative kept</span>}
              </td>
              <td className="border-b border-border py-3 leading-relaxed text-ink/85">{c.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------- graceful degradation */

const outcomes = [
  { item: "Entity 01", status: "normalized", detail: "Valid on the first pass." },
  { item: "Entity 02", status: "normalized", detail: "Malformed the first time, valid after one bounded retry." },
  { item: "Entity 03", status: "needs review", detail: "Sources disagree in a way no rule settles." },
  { item: "Entity 04", status: "missing", detail: "Couldn’t be normalized reliably, so it’s flagged rather than guessed." },
  { item: "Entity 05", status: "normalized", detail: "Valid on the first pass." },
] as const;

const statusStyle = {
  normalized: "text-ink",
  "needs review": "text-accent",
  missing: "text-secondary",
} as const;

export function OutcomeLedger() {
  const count = (s: string) => outcomes.filter((o) => o.status === s).length;
  return (
    <div>
      <ul>
        {outcomes.map((o) => (
          <li key={o.item} className="grid gap-1 border-b border-border py-3 sm:grid-cols-[7rem_8rem_1fr] sm:gap-4">
            <span className="font-mono text-[12px] text-ink">{o.item}</span>
            <span className={cn("font-mono text-[12px]", statusStyle[o.status])}>
              {o.status === "missing" ? <span className="border-b border-dashed border-secondary">{o.status}</span> : o.status}
            </span>
            <span className="text-sm leading-relaxed text-secondary">{o.detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] text-secondary">
        {count("normalized")} normalized &middot; {count("needs review")} needs review &middot; {count("missing")} flagged
        missing. A partial result, with the gaps labelled.
      </p>
    </div>
  );
}
