"use client";

import { useCallback, useState } from "react";
import { Section } from "@/components/layout/Section";
import { ConnectionLayer, type Connection } from "@/components/network/ConnectionLayer";
import { TokenizationVisual } from "@/components/network/TokenizationVisual";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import { boundaries } from "@/lib/network";
import { identity, skills, type SkillId } from "@/lib/portfolio-data";

const connections: Connection[] = [
  { from: { edge: "left", y: boundaries.introToFoundations[0] }, to: { el: "identity", side: "left" } },
  { from: { el: "identity", side: "right" }, to: { el: "tokens", side: "left" } },
  // Each keyword's mapping row leads into its skill node.
  ...skills.map(
    (s): Connection => ({ from: { el: `map-${s.id}`, side: "right" }, to: { el: `skill-${s.id}`, side: "left" }, group: s.id }),
  ),
  ...skills.map(
    (s, i): Connection => ({
      from: { el: `skill-${s.id}`, side: "right" },
      to: { edge: "right", y: boundaries.foundationsToProjects[i] },
      group: s.id,
    }),
  ),
];

function IdentityBlock() {
  return (
    <figure data-anchor="identity" className="rounded-[3px] border border-border bg-canvas">
      <figcaption className="flex items-center justify-between border-b border-border px-5 py-2.5 font-mono text-[11px] text-secondary">
        <span>self.init()</span>
        <span>identity</span>
      </figcaption>
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-lg font-medium leading-snug tracking-[-0.015em] xl:text-xl">{identity.heading}</h3>
        <div className="mt-3 space-y-3 text-base leading-[1.6] text-ink/85">
          {identity.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function FoundationsSection() {
  // Hovered node or mapping row: its lines render in the accent colour.
  const [activeSkill, setActiveSkill] = useState<SkillId | null>(null);
  // Nodes whose keyword has appeared in the tokenization.
  const [lit, setLit] = useState<readonly SkillId[]>([]);
  const light = useCallback((id: SkillId) => setLit((l) => (l.includes(id) ? l : [...l, id])), []);

  return (
    <Section id="foundations" labelledBy="foundations-title">
      <ConnectionLayer connections={connections} active={activeSkill} className="hidden lg:block" />

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col lg:min-h-full lg:justify-center lg:px-16 lg:pt-20 lg:pb-20">
        <header>
          <SectionLabel number="02" label="Foundations" />
          <h2 id="foundations-title" className="mt-5 text-[28px] font-medium leading-tight tracking-[-0.025em] sm:text-3xl lg:text-[36px] xl:text-[40px]">
            From <code className="font-mono text-[0.82em] font-normal tracking-normal">self.init()</code> to building blocks.
          </h2>
          <p className="mt-3 max-w-[72ch] text-[15px] leading-relaxed text-secondary sm:text-base">
            My background, interests, and experience, tokenized into the core skills that power my work.
          </p>
        </header>

        {/* Identity → tokenization → skills, roughly 35 / 20 / 45. The column gaps carry the connections. */}
        <div className="mt-10 grid items-center gap-8 lg:mt-10 lg:grid-cols-[minmax(0,36fr)_minmax(0,19fr)_minmax(0,45fr)] lg:gap-x-[clamp(2.5rem,4.5vw,4.5rem)]">
          <IdentityBlock />

          <TokenizationVisual anchor="tokens" onKeyword={light} onHighlight={setActiveSkill} />

          <ul className="space-y-3">
            {skills.map((s) => (
              <li
                key={s.id}
                data-anchor={`skill-${s.id}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActiveSkill(s.id)}
                onPointerLeave={() => setActiveSkill(null)}
                className={cn(
                  "rounded-[3px] border bg-canvas px-5 py-4 transition-colors duration-300",
                  activeSkill === s.id ? "border-ink/30" : "border-border",
                )}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "font-mono text-[11px] transition-colors duration-500",
                      lit.includes(s.id) ? "text-accent" : "text-secondary",
                    )}
                  >
                    {s.number}
                  </span>
                  <h3 className="text-base font-medium tracking-[-0.01em]">{s.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-secondary">{s.description}</p>
                <ul aria-label={`${s.title} skills`} className="mt-3 flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[2px] border border-border px-1.5 py-0.5 font-mono text-[11px] leading-5 text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
