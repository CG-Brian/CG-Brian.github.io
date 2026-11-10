/**
 * Diagrams for the Telecom Operations Decision Agent case study.
 * Structure, rules and thresholds follow the public repository (CG-Brian/telecom-ops-agent).
 * Channel names are anonymised; signals in the multi-domain example are illustrative.
 */
import { cn } from "@/lib/cn";
import { Chip, Edge, PanelLabel, Pipeline } from "./diagram-primitives";

/* ------------------------------------------------------- Snowflake AI stack */

type Role = "Data access" | "Semantic interpretation" | "Query execution" | "Deterministic computation" | "LLM synthesis" | "User interaction";

const stack: { name: string; role: Role; does: string }[] = [
  { name: "Analytical views", role: "Data access", does: "Prepared business datasets: contracts, funnel stages, channels, call statistics." },
  { name: "Semantic View", role: "Semantic interpretation", does: "A YAML semantic model mapping business words to tables, columns and metrics." },
  { name: "Cortex Analyst", role: "Semantic interpretation", does: "Turns a question plus the semantic model into SQL." },
  { name: "SQL execution · Snowpark", role: "Query execution", does: "Runs the SQL on a warehouse inside the right database and schema context." },
  { name: "Python evidence engine", role: "Deterministic computation", does: "Filters, scores, compares and detects conflicts. No model involved." },
  { name: "Cortex Complete", role: "LLM synthesis", does: "Explains computed evidence and drafts actions." },
  { name: "Streamlit", role: "User interaction", does: "The decision UI, in Snowflake or run locally." },
];

const roleTone: Record<Role, string> = {
  "Data access": "text-secondary",
  "Semantic interpretation": "text-accent",
  "Query execution": "text-secondary",
  "Deterministic computation": "text-ink",
  "LLM synthesis": "text-accent",
  "User interaction": "text-secondary",
};

export function SnowflakeStack() {
  return (
    <div>
      <ol className="relative pl-7 before:absolute before:top-6 before:bottom-6 before:left-[3px] before:w-px before:bg-connection">
        {stack.map((s, i) => {
          const model = s.role === "LLM synthesis" || s.name === "Cortex Analyst";
          return (
            <li key={s.name} className={cn("relative py-4", i > 0 && "border-t border-border")}>
              <span
                aria-hidden
                className={cn(
                  "absolute top-[23px] -left-7 size-[7px] rounded-full border",
                  model ? "border-accent bg-accent" : "border-secondary bg-canvas",
                )}
              />
              <div className="grid gap-1 sm:grid-cols-[14rem_11rem_1fr] sm:items-baseline sm:gap-6">
                <p className="text-[15px] font-medium tracking-[-0.01em]">{s.name}</p>
                <p className={cn("font-mono text-[10px] uppercase tracking-[0.06em]", roleTone[s.role])}>{s.role}</p>
                <p className="text-sm leading-relaxed text-secondary">{s.does}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 border-t border-border pt-4 font-mono text-[11px] leading-relaxed text-secondary">
        <span className="mr-1.5 inline-block size-[7px] rounded-full bg-accent align-middle" /> model-backed steps &middot;
        warehouses supply the compute underneath every query
      </p>
    </div>
  );
}

/* ----------------------------------------------- natural language to SQL */

export function QuestionToEvidence() {
  return (
    <Pipeline
      label="Advanced agent"
      steps={[
        { label: "Question" },
        { label: "Intent & domains", note: "keyword routing" },
        { label: "Cortex Analyst", tone: "accent", note: "+ Semantic View" },
        { label: "Generated SQL", note: "pulled from the response" },
        { label: "Snowpark", note: "executes" },
        { label: "Evidence records" },
      ]}
    />
  );
}

const breakpoints = [
  { where: "Authentication", what: "Session tokens weren’t reliably reachable for REST calls; a programmatic access token became the dependable path." },
  { where: "REST request", what: "Host, endpoint and headers had to be right before the question was even read." },
  { where: "Semantic View reference", what: "A fully qualified name pointing one schema off fails as surely as a bad question." },
  { where: "Database & schema context", what: "Generated SQL is only correct inside the context it was written for." },
  { where: "Permissions", what: "The role running the query needs access to the view, the model and the warehouse." },
  { where: "Timeouts & retries", what: "Analyst calls got a longer timeout and one retry instead of failing on the first slow response." },
  { where: "Local vs. hosted", what: "Snowpark sessions start differently on a laptop and inside Snowflake." },
];

export function IntegrationFailures() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-y-2">
        <Chip tone="muted">&ldquo;Cortex Analyst request failed&rdquo;</Chip>
        <span className="w-10 sm:w-16">
          <Edge />
        </span>
        <span className="font-mono text-[11px] text-secondary">could have broken at any of these, before the question mattered</span>
      </div>
      <ul className="mt-5 border-t border-border">
        {breakpoints.map((b) => (
          <li key={b.where} className="grid gap-1 border-b border-border py-3 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <span className="font-mono text-[12px] text-ink">{b.where}</span>
            <span className="text-sm leading-relaxed text-secondary">{b.what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------- three questions, three owners */

const owners = [
  { who: "Cortex Analyst", asks: "What query should run to get the relevant evidence?", kind: "Model" },
  { who: "Evidence engine", asks: "What do the returned numbers show under the defined business criteria?", kind: "Deterministic" },
  { who: "Cortex Complete", asks: "How should the evidence and priorities be communicated?", kind: "Model" },
];

export function ThreeOwners() {
  return (
    <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
      {owners.map((o, i) => (
        <li key={o.who} className={cn("sm:px-6", i > 0 && "sm:border-l sm:border-border", i === 0 && "sm:pl-0")}>
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.06em]", o.kind === "Model" ? "text-accent" : "text-ink")}>
            {o.kind}
          </p>
          <p className="mt-2 text-[15px] font-medium">{o.who}</p>
          <p className="mt-3 text-lg leading-snug tracking-[-0.01em] text-ink/85">&ldquo;{o.asks}&rdquo;</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------ multi-domain engine */

type Signal = "good" | "neutral" | "bad" | "context";

const domains: { name: string; reads: string; signal: Signal; note: string }[] = [
  { name: "Marketing", reads: "CVR, revenue per session, sessions, channel rank", signal: "good", note: "Strong acquisition" },
  { name: "Funnel", reads: "Stage conversion, drop-off, bottleneck", signal: "bad", note: "Weak conversion at one stage" },
  { name: "Customer service", reads: "Connection rate, call patterns, target", signal: "good", note: "Above target" },
  { name: "Sales", reads: "Contracts, revenue, region", signal: "context", note: "Context for the decision" },
];

const signalStyle: Record<Signal, string> = {
  good: "border-ink/40 text-ink",
  neutral: "border-border text-secondary",
  bad: "border-accent/60 text-accent",
  context: "border-dashed border-border text-secondary",
};

const priorities = [
  { area: "Funnel", action: "Fix the bottleneck stage", why: "Direct cause: customers are lost after they arrive." },
  { area: "Marketing", action: "Test a budget increase on the strongest channel", why: "Growth opportunity, but only worth it once conversion holds." },
  { area: "Customer service", action: "Monitor peak hours", why: "Fine for now; keep an eye on it." },
];

export function MultiDomainEngine() {
  return (
    <div>
      <PanelLabel>1 &middot; Evidence by domain</PanelLabel>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {domains.map((d) => (
          <li key={d.name} className="border-t border-border pt-3">
            <p className="text-[15px] font-medium">{d.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-secondary">{d.reads}</p>
            <p className={cn("mt-3 inline-block rounded-[3px] border px-2 py-0.5 font-mono text-[11px]", signalStyle[d.signal])}>
              {d.signal === "context" ? "context" : `signal: ${d.signal}`}
            </p>
            <p className="mt-1.5 text-xs text-ink/80">{d.note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 border-t border-border pt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <div>
          <PanelLabel>2 &middot; Conflict detection</PanelLabel>
          <p className="mt-4 font-mono text-[12px] leading-relaxed text-secondary">
            if marketing is <span className="text-ink">good</span> and funnel is <span className="text-accent">bad</span>
          </p>
          <p className="mt-2 text-[15px] leading-snug text-ink">
            &ldquo;Acquisition is healthy, but performance is being lost in the conversion process.&rdquo;
          </p>
          <p className="mt-3 text-xs leading-relaxed text-secondary">
            An explicit business rule. It flags a pattern worth acting on; it doesn&rsquo;t prove what caused it.
          </p>
        </div>
        <div>
          <PanelLabel>3 &middot; Prioritized actions</PanelLabel>
          <ol className="mt-4 space-y-3">
            {priorities.map((p, i) => (
              <li key={p.area} className="grid grid-cols-[1.75rem_1fr] gap-2">
                <span className={cn("font-mono text-lg leading-6", i === 0 ? "text-accent" : "text-secondary")}>{i + 1}</span>
                <span>
                  <span className="block text-[15px] leading-6 text-ink">
                    {p.action} <span className="font-mono text-[11px] text-secondary">&middot; {p.area}</span>
                  </span>
                  <span className="block text-xs leading-relaxed text-secondary">{p.why}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------ CVR-only vs composite rank */

const channels = [
  { label: "Channel A", cvrRank: 1, compositeRank: 2 },
  { label: "Channel B", cvrRank: 2, compositeRank: 1 },
  { label: "Channel C", cvrRank: 3, compositeRank: 13 },
  { label: "Channel D", cvrRank: 4, compositeRank: 6 },
  { label: "Channel E", cvrRank: 5, compositeRank: 7 },
];

export function RankingComparison() {
  return (
    <div>
      <div className="grid grid-cols-[3rem_1fr_auto] gap-x-4 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary sm:grid-cols-[8rem_7rem_1fr_7rem] sm:gap-x-6">
        <span>
          CVR<span className="hidden sm:inline">-only rank</span>
        </span>
        <span>Channel</span>
        <span className="hidden sm:block" />
        <span className="text-right">
          Composite<span className="hidden sm:inline"> rank</span>
        </span>
      </div>
      <ul className="mt-2 border-t border-border">
        {channels.map((c) => {
          const trap = c.compositeRank > 5;
          return (
            <li key={c.label} className="grid grid-cols-[3rem_1fr_auto] items-center gap-x-4 border-b border-border py-3 sm:grid-cols-[8rem_7rem_1fr_7rem] sm:gap-x-6">
              <span className="font-mono text-2xl text-ink">#{c.cvrRank}</span>
              <span className="font-mono text-[12px] text-ink sm:order-none">{c.label}</span>
              <span className="hidden sm:block">
                <Edge label={trap ? "drops out of the top five" : "holds up"} tone={trap ? "muted" : "accent"} />
              </span>
              <span className={cn("text-right font-mono text-2xl", trap ? "text-secondary" : "text-accent")}>
                #{c.compositeRank}
                <span className="sr-only">{trap ? " (outside the composite top five)" : ""}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-mono text-[11px] leading-relaxed text-secondary">
        Composite score = 0.4 &times; CVR + 0.6 &times; normalized revenue per session, among channels with at least 500
        sessions and 50 contracts.
      </p>
    </div>
  );
}

/* --------------------------------------------- stable demo vs advanced agent */

export function DemoVsAgent() {
  return (
    <div className="space-y-10">
      <Pipeline
        label="Verified demo"
        steps={[
          { label: "One of three questions" },
          { label: "Verified SQL", note: "generated once, then pinned" },
          { label: "Rules" },
          { label: "Cortex Complete", tone: "accent" },
          { label: "Streamlit in Snowflake" },
        ]}
      />
      <Pipeline
        label="Advanced agent"
        steps={[
          { label: "Any question" },
          { label: "Cortex Analyst", tone: "accent", note: "dynamic SQL" },
          { label: "Multi-domain evidence" },
          { label: "Conflicts & priorities" },
          { label: "Cortex Complete", tone: "accent" },
          { label: "Local Streamlit" },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------- reported results */

const reported = [
  { figure: "15 / 15", what: "cases matched their expected rank band", note: "Agreement with the project’s own scoring rule, not proof of an optimal policy." },
  { figure: "3 / 3", what: "multi-domain cases put the funnel first, as expected", note: "Three cases; the expected answer follows the same prioritization rules." },
  { figure: "0", what: "recommended-channel CVR values off by more than 2 points", note: "Checks the evidence layer against the dataset, not every number in the LLM’s prose." },
  { figure: "4.4× / 8.3×", what: "CVR and revenue per session of the top channel vs. the valid-channel average", note: "A historical comparison inside the dataset, not a realized business effect." },
];

export function ReportedResults() {
  return (
    <ul className="my-10 border-t border-border">
      {reported.map((r) => (
        <li key={r.what} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <span className="text-3xl font-medium tracking-[-0.03em] text-ink">{r.figure}</span>
          <span>
            <span className="block text-[17px] leading-snug text-ink/85">{r.what}</span>
            <span className="mt-1 block font-mono text-[11px] text-secondary">{r.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
