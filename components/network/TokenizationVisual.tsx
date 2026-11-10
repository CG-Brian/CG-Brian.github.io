"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { skills, tokens, type SkillId } from "@/lib/portfolio-data";

const STAGGER = 0.14;
const EASE = [0.2, 0, 0, 1] as const;

const mapping = tokens.flatMap((t) => {
  const skill = skills.find((s) => s.id === t.skill);
  return skill ? [{ keyword: t.text, skill }] : [];
});

type Props = {
  anchor?: string;
  /** Called once per keyword as it appears, so the matching skill node can respond. */
  onKeyword?: (skill: SkillId) => void;
  /** Pointer over a mapping row; null when it leaves. */
  onHighlight?: (skill: SkillId | null) => void;
};

/**
 * Semantic tokenization of how I work. Tokens appear in sequence the first time
 * the figure is visible; the three keywords then settle into the accent colour.
 * Each mapping row carries a `map-<skill>` anchor where its line leaves the figure.
 */
export function TokenizationVisual({ anchor, onKeyword, onHighlight }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [lit, setLit] = useState<readonly SkillId[]>([]);

  useEffect(() => {
    if (!inView) return;
    const timers = tokens.flatMap(({ skill }, i) =>
      skill
        ? [
            window.setTimeout(
              () => {
                setLit((l) => (l.includes(skill) ? l : [...l, skill]));
                onKeyword?.(skill);
              },
              reduce ? 0 : (i * STAGGER + 0.3) * 1000,
            ),
          ]
        : [],
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, onKeyword]);

  return (
    <figure ref={ref} data-anchor={anchor} className="rounded-[3px] border border-border bg-canvas p-5">
      <figcaption className="font-mono text-[11px] text-secondary">tokenize(self)</figcaption>

      <ul aria-hidden className="mt-4 flex flex-wrap gap-1.5">
        {tokens.map(({ text, skill }, i) => {
          const isLit = !!skill && lit.includes(skill);
          return (
            <motion.li
              key={text}
              // Same initial state on server and client; reduced motion just skips the timing.
              initial={{ opacity: 0, y: 6 }}
              animate={reduce || inView ? { opacity: 1, y: 0 } : undefined}
              transition={reduce ? { duration: 0 } : { delay: i * STAGGER, duration: 0.3, ease: EASE }}
              className={cn(
                "rounded-[2px] border bg-canvas px-1.5 py-0.5 font-mono text-[12px] leading-5 transition-colors duration-500",
                isLit ? "border-accent/50 text-accent" : "border-border text-ink",
              )}
            >
              {text}
            </motion.li>
          );
        })}
      </ul>

      <ul aria-hidden className="mt-5 border-t border-border">
        {mapping.map(({ keyword, skill }) => (
          <li
            key={skill.id}
            // Extends to the figure's right edge so the outgoing line starts on the border.
            data-anchor={`map-${skill.id}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && onHighlight?.(skill.id)}
            onPointerLeave={() => onHighlight?.(null)}
            className="-mr-5 border-b border-border py-2 pr-5 last:border-b-0 last:pb-0"
          >
            <span
              className={cn(
                "font-mono text-[11px] transition-colors duration-500",
                lit.includes(skill.id) ? "text-accent" : "text-secondary",
              )}
            >
              {keyword} &rarr;
            </span>
            <span className="block text-[13px] leading-snug text-ink">{skill.title}</span>
          </li>
        ))}
      </ul>

      <p className="sr-only">
        A semantic tokenization of my work into: {tokens.map((t) => t.text).join(", ")}.{" "}
        {mapping.map(({ keyword, skill }) => `“${keyword}” leads to ${skill.title}.`).join(" ")}
      </p>
    </figure>
  );
}
