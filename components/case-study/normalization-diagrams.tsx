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
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
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

/* ------------------------------------------- parser: synthetic C&E workbook */

type Cell = { v?: string; colSpan?: number; rowSpan?: number; kind?: "header" | "merged" | "hit" | "struck" };

// A synthetic Cause & Effect sheet: two header rows over the effects, a vertically merged
// description and voting group, one struck-through (inactive) cause.
const sheetRows: { n: number; cells: Cell[] }[] = [
  { n: 1, cells: [{ v: "CAUSES", colSpan: 3, kind: "header" }, { v: "EFFECTS", colSpan: 4, kind: "header" }] },
  {
    n: 2,
    cells: [
      { v: "TAG", kind: "header" },
      { v: "DESCRIPTION", kind: "header" },
      { v: "VOTING", kind: "header" },
      { v: "XV-201", kind: "header" },
      { v: "P-101", kind: "header" },
      { v: "ALM-1", kind: "header" },
      { v: "FAN-3", kind: "header" },
    ],
  },
  {
    n: 3,
    cells: [
      { v: "", colSpan: 3 },
      { v: "Close valve", kind: "header" },
      { v: "Stop pump", kind: "header" },
      { v: "Alarm", kind: "header" },
      { v: "Start fan", kind: "header" },
    ],
  },
  { n: 4, cells: [{ v: "TT-101" }, { v: "Temp. high" }, { v: "1oo1" }, { v: "C", kind: "hit" }, { v: "S", kind: "hit" }, { v: "X", kind: "hit" }, { v: "" }] },
  {
    n: 5,
    cells: [
      { v: "PT-201" },
      { v: "Pressure high", rowSpan: 2, kind: "merged" },
      { v: "2oo3", rowSpan: 2, kind: "merged" },
      { v: "C", kind: "hit" },
      { v: "" },
      { v: "X", kind: "hit" },
      { v: "" },
    ],
  },
  { n: 6, cells: [{ v: "PT-202" }, { v: "C", kind: "hit" }, { v: "" }, { v: "X", kind: "hit" }, { v: "" }] },
  { n: 7, cells: [{ v: "LS-301", kind: "struck" }, { v: "Level low", kind: "struck" }, { v: "1oo1", kind: "struck" }, { v: "", kind: "struck" }, { v: "S", kind: "struck" }, { v: "", kind: "struck" }, { v: "", kind: "struck" }] },
  { n: 8, cells: [{ v: "FS-401" }, { v: "Flow low" }, { v: "1oo1" }, { v: "" }, { v: "S 5s", kind: "hit" }, { v: "X", kind: "hit" }, { v: "S", kind: "hit" }] },
];

const cellClass: Record<NonNullable<Cell["kind"]> | "plain", string> = {
  header: "bg-border/30 text-ink",
  merged: "outline outline-1 -outline-offset-2 outline-dashed outline-secondary/70 text-ink",
  hit: "bg-accent/10 text-accent",
  struck: "text-secondary line-through decoration-secondary/60",
  plain: "text-ink",
};

export function ParserDiagram() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <PanelLabel>Synthetic Cause &amp; Effect sheet</PanelLabel>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse font-mono text-[11px]">
              <caption className="sr-only">
                Synthetic Cause and Effect matrix with merged headers, a merged voting group, a struck-through cause and
                actions at row-column intersections.
              </caption>
              <thead>
                <tr className="text-secondary">
                  <td className="w-6" />
                  {["A", "B", "C", "D", "E", "F", "G"].map((c) => (
                    <th key={c} scope="col" className="border-b border-border px-2 py-1 text-left font-normal">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetRows.map((r) => (
                  <tr key={r.n}>
                    <th scope="row" className="pr-2 text-left font-normal text-secondary">
                      {r.n}
                    </th>
                    {r.cells.map((c, i) => (
                      <td
                        key={i}
                        colSpan={c.colSpan}
                        rowSpan={c.rowSpan}
                        className={cn("border border-border px-2 py-1.5 whitespace-nowrap", cellClass[c.kind ?? "plain"])}
                      >
                        {c.v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-secondary">
            <span>
              <span className="mr-1.5 inline-block size-2.5 align-middle outline outline-1 outline-dashed outline-secondary" />
              merged range: value only in its anchor cell
            </span>
            <span>
              <span className="mr-1.5 inline-block size-2.5 bg-accent/30 align-middle" />
              intersection = relationship
            </span>
            <span className="line-through">struck-through: inactive</span>
          </p>
        </div>

        <div>
          <PanelLabel>One structured raw rule</PanelLabel>
          <pre className="mt-3 overflow-x-auto rounded-[3px] border border-border px-4 py-3 font-mono text-[11.5px] leading-[1.7] text-secondary">
            <code>
              {"{\n"}
              {"  "}<span className="text-ink">&quot;cause&quot;</span>: {"{ "}tag: <span className="text-ink">&quot;PT-202&quot;</span>, row: <span className="text-accent">6</span>{" },\n"}
              {"  "}<span className="text-ink">&quot;effect&quot;</span>: {"{ "}tag: <span className="text-ink">&quot;XV-201&quot;</span>, col: <span className="text-accent">&quot;D&quot;</span>{" },\n"}
              {"  "}<span className="text-ink">&quot;cell&quot;</span>: <span className="text-accent">&quot;D6&quot;</span>, raw: <span className="text-ink">&quot;C&quot;</span>,{"\n"}
              {"  "}<span className="text-ink">&quot;description&quot;</span>: <span className="text-ink">&quot;Pressure high&quot;</span>, from: <span className="text-accent">&quot;B5&quot;</span>,{"\n"}
              {"  "}<span className="text-ink">&quot;voting&quot;</span>: <span className="text-ink">&quot;2oo3&quot;</span>, from: <span className="text-accent">&quot;C5&quot;</span>{"\n"}
              {"}"}
            </code>
          </pre>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            Row 6 has no description or voting value of its own. Both resolve from the merge anchors in row 5, and the
            rule keeps the original coordinates.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <Pipeline
          label="Parse"
          steps={[
            { label: "ExcelJS workbook", note: "sheets, rows, cells, merges" },
            { label: "Coordinate-aware parser", tone: "accent", note: "confirmed read settings" },
            { label: "Structured raw rules", note: "with source coordinates" },
          ]}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------- zip() vs coordinate-based mapping */

const zipHeaders = ["TAG", "DESCRIPTION", "VOTING", "XV-201"];

export function CoordinateMapping() {
  const zipped = ["PT-202", "C", "—", "—"];
  const coords = [
    { v: "PT-202", from: "A6" },
    { v: "Pressure high", from: "B5 · merge anchor" },
    { v: "2oo3", from: "C5 · merge anchor" },
    { v: "C", from: "D6" },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
      <section className="lg:border-r lg:border-border lg:pr-8">
        <PanelLabel>Before · filter blanks, then zip with headers</PanelLabel>
        <p className="mt-3 font-mono text-[11px] text-secondary">row 6 non-empty cells → [&quot;PT-202&quot;, &quot;C&quot;]</p>
        <ul className="mt-3 space-y-1.5">
          {zipHeaders.map((h, i) => (
            <li key={h} className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5 text-[13px]">
              <span className="font-mono text-[11px] text-secondary">{h}</span>
              <span className={cn("font-mono text-[12px]", i > 1 ? "text-secondary" : "text-ink")}>
                <span className={i === 1 ? "underline decoration-dotted underline-offset-2" : undefined}>{zipped[i]}</span>
                {i === 1 && <span className="ml-2 text-[10px] text-secondary">an action landed in the description</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="lg:pl-8">
        <PanelLabel className="text-accent">After · map by original coordinates</PanelLabel>
        <p className="mt-3 font-mono text-[11px] text-secondary">each header owns a column; merges resolve to their anchor</p>
        <ul className="mt-3 space-y-1.5">
          {zipHeaders.map((h, i) => (
            <li key={h} className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5 text-[13px]">
              <span className="font-mono text-[11px] text-secondary">{h}</span>
              <span className="font-mono text-[12px] text-ink">
                {coords[i].v} <span className="ml-1 text-[10px] text-accent">{coords[i].from}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---------------------------------------------- read-settings inference */

const signals = ["Used range & dimensions", "Merged-cell structure", "TAG / DESCRIPTION terms", "Field-name patterns", "Cause & Effect axes", "Matrix intersections", "IO-list layout"];

const suggested = [
  { key: "cause header rows", value: "2–3" },
  { key: "tag column", value: "A" },
  { key: "description column", value: "B" },
  { key: "effect tag row", value: "2" },
  { key: "matrix region", value: "D4:G8" },
  { key: "voting column", value: "C", review: true },
];

export function ReadSettingsInference() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Flow"
        steps={[
          { label: "Heterogeneous sheet" },
          { label: "Candidate detection", note: "heuristics, LLM for ambiguity" },
          { label: "Suggested settings", tone: "accent" },
          { label: "Human confirmation", note: "preview, correct" },
          { label: "Deterministic parser" },
        ]}
      />
      <div className="grid gap-8 border-t border-border pt-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <PanelLabel>Signals considered</PanelLabel>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {signals.map((s) => (
              <li key={s}>
                <Chip className="py-0.5 text-[11px]">{s}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <PanelLabel>Suggested read settings (synthetic)</PanelLabel>
          <dl className="mt-3 font-mono text-[12px]">
            {suggested.map((s) => (
              <div key={s.key} className="flex items-baseline justify-between gap-3 border-b border-border py-1.5">
                <dt className="text-secondary">{s.key}</dt>
                <dd className={s.review ? "text-accent" : "text-ink"}>
                  {s.value}
                  {s.review && <span className="ml-2 text-[10px]">ambiguous · confirm</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- error analysis */

const fields = ["Cause identity", "Effect identity", "IO type", "Action", "Delay time", "Voting", "Relationship presence"];

const failures = [
  { kind: "RESET propagated to every rule of a cause", fix: "Kept only where the source states it explicitly" },
  { kind: "Tag written as “PT 202”, “PT_202” and “PT-202”", fix: "One normalized identifier, original text kept" },
  { kind: "Relationship inferred with no mark at the intersection", fix: "No rule emitted; missing stays missing" },
];

export function ErrorAnalysis() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Loop"
        steps={[
          { label: "Model output" },
          { label: "Field-level comparison", note: "against reference records" },
          { label: "Error classification", tone: "accent", note: "by field and convention" },
          { label: "Targeted correction", note: "instructions, schema, rules" },
          { label: "Re-evaluation" },
        ]}
      />
      <div className="border-t border-border pt-6">
        <PanelLabel>Compared field by field</PanelLabel>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {fields.map((f) => (
            <li key={f}>
              <Chip className="py-0.5 text-[11px]">{f}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border pt-6">
        <PanelLabel>Illustrative failure modes (synthetic)</PanelLabel>
        <ul className="mt-3">
          {failures.map((f) => (
            <li key={f.kind} className="grid gap-1 border-b border-border py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
              <span className="text-sm text-ink/85">{f.kind}</span>
              <span aria-hidden className="hidden font-mono text-secondary sm:block">&rarr;</span>
              <span className="text-sm text-accent">{f.fix}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------- TrackedValueDTO trace */

function MiniSheet({ title, cells, hit }: { title: string; cells: [string, string][]; hit: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-secondary">{title}</p>
      <dl className="mt-1.5 font-mono text-[11px]">
        {cells.map(([addr, v]) => (
          <div
            key={addr}
            className={cn(
              "flex justify-between gap-3 border-b border-border px-2 py-1",
              addr === hit && "bg-accent/10 text-accent outline outline-1 -outline-offset-1 outline-accent/60",
            )}
          >
            <dt className={addr === hit ? "text-accent" : "text-secondary"}>{addr}</dt>
            <dd className={addr === hit ? "text-accent" : "text-ink"}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TrackedValueTrace() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-8">
        <section className="space-y-5">
          <PanelLabel>1 · Sources</PanelLabel>
          <MiniSheet title="IO list" cells={[["IO!B18", "PT-202"], ["IO!D18", "DI"], ["IO!E18", "Panel 2"]]} hit="IO!D18" />
          <MiniSheet title="C&E matrix" cells={[["C&E!A6", "PT-202"], ["C&E!K6", "AI"]]} hit="C&E!K6" />
        </section>

        <section>
          {/* Not a PanelLabel: the type name must keep its casing. */}
          <p className="font-mono text-[11px] tracking-[0.06em] text-accent">
            <span className="uppercase">2 · </span>TrackedValueDTO
          </p>
          <pre className="mt-3 overflow-x-auto rounded-[3px] border border-border px-4 py-3 font-mono text-[11.5px] leading-[1.7] text-secondary">
            <code>
              {"io_type: {\n"}
              {"  "}value: <span className="text-ink">&quot;DI&quot;</span>,{"\n"}
              {"  "}source: <span className="text-ink">&quot;IO_LIST&quot;</span>,{"\n"}
              {"  "}source_cells: [<span className="text-accent">&quot;IO!D18&quot;</span>],{"\n"}
              {"  "}conflict: {"{\n"}
              {"    "}alternatives: [{"{\n"}
              {"      "}value: <span className="text-ink">&quot;AI&quot;</span>, source: <span className="text-ink">&quot;CNE&quot;</span>,{"\n"}
              {"      "}source_cells: [<span className="text-accent">&quot;C&E!K6&quot;</span>]{"\n"}
              {"    }],\n"}
              {"    "}rule: <span className="text-ink">&quot;IO list wins for signal type&quot;</span>{"\n"}
              {"  }\n}"}
            </code>
          </pre>
        </section>

        <section>
          <PanelLabel>3 · Review interface</PanelLabel>
          <div className="mt-3 rounded-[3px] border border-border">
            <div className="flex items-baseline justify-between border-b border-border px-3 py-2">
              <span className="text-[13px] text-ink">PT-202 · IO type</span>
              <span className="font-mono text-[12px] text-ink">DI</span>
            </div>
            <div className="space-y-1.5 px-3 py-2.5 text-xs">
              <p className="flex justify-between gap-2">
                <span className="text-secondary">source</span>
                <span className="font-mono text-ink">IO list · D18</span>
              </p>
              <p className="flex justify-between gap-2">
                <span className="text-secondary">conflict</span>
                <span className="font-mono text-accent">1 alternative (AI, C&amp;E K6)</span>
              </p>
              <p className="pt-1 font-mono text-[11px] text-accent">Show in sheet &rarr; highlights D18</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-secondary">
            Rows and columns use the rule&rsquo;s anchors; field highlights use source cells only where they&rsquo;re
            reliable.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t border-border pt-5">
        <PanelLabel>Three different levels of “this cell supports it”</PanelLabel>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["Valid address", "“K6” is well-formed A1 notation."],
            ["Existing cell", "K6 exists in that sheet’s used range."],
            ["Supporting cell", "K6 actually holds the value being asserted."],
          ].map(([k, v], i) => (
            <li key={k} className="border-l border-border pl-3">
              <p className="font-mono text-[11px] text-ink">
                <span className="text-accent">{i + 1}</span> {k}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-secondary">{v}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function TraceFlow() {
  return (
    <Pipeline
      label="Across services"
      steps={[
        { label: "Frontend workbook", note: "ExcelJS JSON" },
        { label: "Backend transport", note: "state, jobs, storage" },
        { label: "FastAPI parse & normalize", tone: "accent" },
        { label: "Tracked values", tone: "accent" },
        { label: "Backend response" },
        { label: "Frontend review", note: "source highlighting" },
      ]}
    />
  );
}
