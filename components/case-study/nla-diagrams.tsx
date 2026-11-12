/**
 * Conceptual figures for the multimodal NLA research overview. Nothing here depicts a
 * result: the published NLA path is Anthropic's work, and the multimodal path is proposed.
 */
import { cn } from "@/lib/cn";
import { Chip, Edge, PanelLabel, Pipeline } from "./diagram-primitives";

/* --------------------------------------------------- published vs. proposed */

export function NLAConcept() {
  return (
    <div className="space-y-10">
      <div>
        <Pipeline
          label="Published"
          steps={[
            { label: "LLM activation" },
            { label: "Activation verbalizer", tone: "accent", note: "AV: activation → text" },
            { label: "Explanation", note: "natural language" },
            { label: "Activation reconstructor", tone: "accent", note: "AR: text → activation" },
            { label: "Reconstruction" },
          ]}
        />
        <p className="mt-3 text-xs leading-relaxed text-secondary lg:ml-[7rem]">
          Anthropic, 2026. The AV is trained to produce explanations from which the AR can reconstruct the activation.
        </p>
      </div>
      <div className="border-t border-border pt-6">
        <Pipeline
          label="Proposed"
          steps={[
            { label: "Generative-model activations", tone: "muted", note: "diffusion / flow; which layers & steps?" },
            { label: "Interpretable representation", tone: "muted", note: "text, relations or structure?" },
            { label: "Validation", tone: "muted", note: "reconstruction · controlled prompts · interventions" },
          ]}
        />
        <p className="mt-3 font-mono text-[11px] text-accent lg:ml-[7rem]">
          Conceptual · proposed direction, not implemented
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------- concept vs. relationship */

const levels = [
  { name: "Present in the representation", note: "dog, bicycle" },
  { name: "Inferred from the representation", note: "dog → riding → bicycle" },
  { name: "Demonstrated by intervention", note: "changing it changes the image as predicted" },
];

export function RelationExample() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      <div>
        <PanelLabel>“A dog riding a bicycle”</PanelLabel>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Chip className="py-0.5 text-[11px]">dog</Chip>
            <Chip className="py-0.5 text-[11px]">bicycle</Chip>
            <span className="self-center font-mono text-[10px] text-secondary">isolated concepts</span>
          </div>
          <div className="flex items-center">
            <Chip className="py-0.5 text-[11px]">Dog</Chip>
            <Edge label="riding" />
            <Chip className="py-0.5 text-[11px]">Bicycle</Chip>
          </div>
          <p className="font-mono text-[10px] text-secondary">a relationship, which isolated labels can&rsquo;t express</p>
        </div>
      </div>
      <div>
        <PanelLabel>Three different claims</PanelLabel>
        <ol className="mt-4 space-y-2">
          {levels.map((l, i) => (
            <li key={l.name} className="border-l border-border pl-3">
              <p className="text-[13px] text-ink">
                <span className="mr-1.5 font-mono text-[11px] text-accent">{i + 1}</span>
                {l.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-secondary">{l.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- research questions */

const questions = [
  { id: "RQ1", title: "Multimodal interpretation", q: "Can intermediate activations in image-generation models be mapped to interpretable representations?" },
  { id: "RQ2", title: "Concept relationships", q: "Can structured representations capture relationships and dependencies that isolated feature labels miss?" },
  { id: "RQ3", title: "Faithfulness", q: "Can reconstruction and interventions establish whether those representations reflect behaviorally relevant information?" },
];

export function ResearchQuestions() {
  return (
    <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
      {questions.map((r, i) => (
        <li key={r.id} className={cn("sm:px-6", i > 0 && "sm:border-l sm:border-border", i === 0 && "sm:pl-0")}>
          <p className="font-mono text-2xl tracking-[-0.02em] text-accent">{r.id}</p>
          <p className="mt-2 text-[15px] font-medium">{r.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">{r.q}</p>
        </li>
      ))}
    </ol>
  );
}
