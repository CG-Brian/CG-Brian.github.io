import type { MDXComponents } from "mdx/types";
import { DynamicFMGuidance } from "./DynamicFMGuidance";
import { EntityOnceDiagram } from "./EntityOnceDiagram";
import { NLAConcept, RelationExample, ResearchQuestions } from "./nla-diagrams";
import {
  ArchitectureDiagram,
  CoordinateMapping,
  ErrorAnalysis,
  MatrixToGraph,
  OutcomeLedger,
  ParserDiagram,
  PipelineComparison,
  ProvenanceTrace,
  ReadSettingsInference,
  ReconciliationTable,
  TraceFlow,
  TrackedValueTrace,
} from "./normalization-diagrams";
import {
  AtAGlance,
  CIBeforeAfter,
  ContributionLedger,
  FailureDomains,
  GraphOrdering,
  GuidanceBeforeAfter,
  HybridArchitecture,
  ImageFilterPlacement,
  PriorityDistribution,
  PromptArchitecture,
  QualifiedFacts,
  ReportFlow,
  RetrievalDebug,
  StoryBrief,
  Tradeoff,
} from "./troubleshooting-diagrams";
import { EvidenceInspection, MetricExplorer } from "./StageGroundInteractive";
import {
  DemoVsAgent,
  IntegrationFailures,
  MultiDomainEngine,
  QuestionToEvidence,
  RankingComparison,
  ReportedResults,
  SnowflakeStack,
  ThreeOwners,
} from "./telecom-diagrams";
import { AttentionMasks } from "./CirqloomInteractive";
import {
  CirqloomPipeline,
  EvidenceSources,
  EvidenceStatuses,
  GranularityComparison,
  InterfaceSchematic,
  RepeatedVsControl,
  TestSuites,
} from "./cirqloom-diagrams";
import { ArmProgression, BbtenComparison, M0Paradox, PairedDeltas, ResearchPipeline } from "./stageground-diagrams";

/** Marks content that is intentionally not written yet. */
export function Placeholder({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-[3px] border border-dashed border-border px-4 py-3 font-mono text-xs leading-relaxed text-secondary">
      <span className="text-ink/70">Placeholder</span>
      {children ? <> &middot; {children}</> : null}
    </p>
  );
}

/** A short qualifying note, e.g. confidentiality or exploratory status. */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="mt-8 border-l border-accent pl-4 text-sm leading-relaxed text-secondary [&>p]:mt-0">
      {children}
    </aside>
  );
}

/**
 * A diagram that may run wider than the text column on desktop.
 * The negative margins reach roughly two grid columns either side of the article.
 */
export function Figure({ caption, children }: { caption?: React.ReactNode; children: React.ReactNode }) {
  return (
    <figure className="my-12 lg:-mx-[28%]">
      <div className="rounded-[3px] border border-border bg-canvas p-5 sm:p-7">{children}</div>
      {caption && (
        <figcaption className="mt-3 max-w-[72ch] font-mono text-[11px] leading-relaxed text-secondary">{caption}</figcaption>
      )}
    </figure>
  );
}

/** One sentence worth slowing down for. */
export function Pull({ children }: { children: React.ReactNode }) {
  return (
    // MDX may or may not wrap the text in a <p>; style either form the same way.
    <blockquote className="my-12 text-2xl leading-snug font-medium tracking-[-0.02em] text-ink before:mb-5 before:block before:h-px before:w-10 before:bg-accent sm:text-[28px] [&_p]:mt-0 [&_p]:text-[length:inherit] [&_p]:leading-[inherit] [&_p]:text-ink">
      {children}
    </blockquote>
  );
}

export const mdxComponents: MDXComponents = {
  // Numbered via the `cs` counter that the case-study article resets.
  h2: (props) => (
    <h2
      className="mt-20 border-t border-border pt-6 text-2xl font-medium tracking-[-0.02em] [counter-increment:cs] before:mb-3 before:block before:font-mono before:text-xs before:font-normal before:tracking-normal before:text-accent before:[content:counter(cs,decimal-leading-zero)] first:mt-0 first:border-t-0 first:pt-0"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-12 text-lg font-medium tracking-[-0.01em]" {...props} />,
  p: (props) => <p className="mt-4 text-[17px] leading-relaxed text-ink/85" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-ink/85 marker:text-secondary" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-[17px] leading-relaxed text-ink/85 marker:text-secondary" {...props} />,
  a: (props) => (
    <a className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent" {...props} />
  ),
  code: (props) => <code className="font-mono text-[0.88em]" {...props} />,
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-[3px] border border-border px-5 py-4 font-mono text-[13px] leading-[1.7] text-ink/85 [&>code]:text-[1em]"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  Placeholder,
  Note,
  Figure,
  Pull,
  // Industrial AI Normalization Engine diagrams.
  ArchitectureDiagram,
  PipelineComparison,
  EntityOnceDiagram,
  MatrixToGraph,
  ProvenanceTrace,
  ReconciliationTable,
  OutcomeLedger,
  ParserDiagram,
  CoordinateMapping,
  ReadSettingsInference,
  ErrorAnalysis,
  TrackedValueTrace,
  TraceFlow,
  // Multimodal NLA research overview.
  NLAConcept,
  RelationExample,
  ResearchQuestions,
  // Industrial AI Troubleshooting Platform diagrams.
  HybridArchitecture,
  Tradeoff,
  PriorityDistribution,
  RetrievalDebug,
  GraphOrdering,
  GuidanceBeforeAfter,
  ImageFilterPlacement,
  CIBeforeAfter,
  FailureDomains,
  QualifiedFacts,
  AtAGlance,
  StoryBrief,
  PromptArchitecture,
  ContributionLedger,
  ReportFlow,
  DynamicFMGuidance,
  // StageGround figures.
  ArmProgression,
  EvidenceInspection,
  MetricExplorer,
  PairedDeltas,
  M0Paradox,
  BbtenComparison,
  ResearchPipeline,
  // Telecom Operations Decision Agent diagrams.
  SnowflakeStack,
  QuestionToEvidence,
  IntegrationFailures,
  ThreeOwners,
  MultiDomainEngine,
  RankingComparison,
  DemoVsAgent,
  ReportedResults,
  // Cirqloom figures.
  InterfaceSchematic,
  EvidenceSources,
  CirqloomPipeline,
  AttentionMasks,
  RepeatedVsControl,
  EvidenceStatuses,
  GranularityComparison,
  TestSuites,
};
