"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Id of the element further down the same section to scroll to. */
  targetId: string;
  label: string;
};

/**
 * Desktop hint that a section continues below its first viewport. It only reads the
 * section's own native scroll position, fades once the visitor has scrolled, and on click
 * scrolls the section (never the page) to the target.
 */
export function ScrollCue({ targetId, label }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const onScroll = () => setScrolled(section.scrollTop > 48);
    section.addEventListener("scroll", onScroll, { passive: true });
    return () => section.removeEventListener("scroll", onScroll);
  }, []);

  const go = () => {
    const section = ref.current?.closest("section");
    const target = document.getElementById(targetId);
    if (!section || !target) return;
    // Leave room for the fixed top bar.
    const top = target.getBoundingClientRect().top - section.getBoundingClientRect().top + section.scrollTop - 96;
    section.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={go}
      tabIndex={scrolled ? -1 : 0}
      aria-hidden={scrolled || undefined}
      className={cn(
        "group mt-5 hidden w-fit items-center gap-2 font-mono text-[11px] text-ink/80 transition-opacity duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:inline-flex",
        scrolled && "pointer-events-none opacity-0",
      )}
    >
      {label}
      <span
        aria-hidden
        className="inline-flex size-5 items-center justify-center rounded-full border border-border text-accent transition-colors group-hover:border-accent"
      >
        &darr;
      </span>
    </button>
  );
}
