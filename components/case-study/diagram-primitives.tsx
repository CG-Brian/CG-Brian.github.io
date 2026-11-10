import { cn } from "@/lib/cn";

type Tone = "default" | "accent" | "muted";

const tones: Record<Tone, string> = {
  default: "border-border text-ink",
  accent: "border-accent/50 text-accent",
  muted: "border-dashed border-border text-secondary",
};

/** A node in a case-study diagram: the same mono chip used by the tokenizer. */
export function Chip({ children, tone = "default", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border bg-canvas px-2 py-1 font-mono text-[12px] leading-5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A step-to-step connector: vertical on narrow screens, horizontal from `lg`.
 * Ends in the same small node as the homepage network.
 */
export function Flow() {
  return (
    <span aria-hidden className="relative ml-5 block h-6 w-px shrink-0 lg:mt-[15px] lg:ml-0 lg:h-px lg:w-auto lg:min-w-6 lg:flex-1">
      <span className="absolute inset-0 bg-connection" />
      <span className="absolute bottom-0 left-1/2 size-[5px] -translate-x-1/2 translate-y-1/2 rounded-full border border-secondary bg-canvas lg:top-1/2 lg:right-0 lg:bottom-auto lg:left-auto lg:translate-x-1/2 lg:-translate-y-1/2" />
    </span>
  );
}

/** A horizontal link with its label sitting on the line, e.g. a relationship attribute. */
export function Edge({ label, tone = "accent" }: { label?: string; tone?: "accent" | "muted" }) {
  return (
    <span className="relative flex min-w-8 flex-1 items-center justify-center py-1">
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-connection" />
      {label && (
        <span
          className={cn(
            "relative bg-canvas px-2 text-center font-mono text-[11px] leading-4",
            tone === "accent" ? "text-accent" : "text-secondary",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

/** Small mono label above a diagram panel. */
export function PanelLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[11px] uppercase tracking-[0.06em] text-secondary", className)}>{children}</p>;
}

export type Step = { label: string; note?: string; tone?: "accent" | "muted" };

/** A labelled row of steps: stacked on narrow screens, left-to-right from `lg`. */
export function Pipeline({ label, steps }: { label: React.ReactNode; steps: Step[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[6rem_1fr] lg:gap-4">
      <PanelLabel className="lg:pt-2">{label}</PanelLabel>
      <ol className="flex flex-col lg:flex-row lg:items-start">
        {steps.map((s, i) => (
          <li key={s.label} className={cn("flex flex-col lg:flex-row lg:items-start", i > 0 && "lg:flex-1")}>
            {i > 0 && <Flow />}
            <div className="flex items-baseline gap-3 lg:block">
              <Chip tone={s.tone}>{s.label}</Chip>
              {s.note && <p className="font-mono text-[10px] leading-4 text-secondary lg:mt-1.5 lg:max-w-[15ch]">{s.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
