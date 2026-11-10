"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { NetworkConnection, type Point } from "./NetworkConnection";

/** A point on the container's left/right edge, at a fraction of its height. */
type EdgeAnchor = { edge: "left" | "right"; y: number };
/** A side of an element marked with data-anchor="<el>", at a fraction of its height (default 0.5). */
type ElementAnchor = { el: string; side: "left" | "right"; y?: number };

export type Anchor = EdgeAnchor | ElementAnchor;
export type Connection = { from: Anchor; to: Anchor; group?: string };

type Resolved = Point & { onElement: boolean };
type Line = { from: Resolved; to: Resolved; group?: string };

type Props = {
  /** Keep this array stable (module-level or memoized); it drives re-measurement. */
  connections: readonly Connection[];
  /** Group whose lines render in the accent colour. */
  active?: string | null;
  className?: string;
};

/**
 * Decorative SVG layer that draws connections between anchors inside its parent.
 * The parent must be positioned; the layer sits behind content and ignores the pointer.
 */
export function ConnectionLayer({ connections, active = null, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<Line[]>([]);

  useLayoutEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;

    const resolve = (anchor: Anchor, box: DOMRect): Resolved | null => {
      if ("edge" in anchor) {
        return { x: anchor.edge === "left" ? 0 : box.width, y: anchor.y * box.height, onElement: false };
      }
      const node = container.querySelector(`[data-anchor~="${anchor.el}"]`);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return {
        x: (anchor.side === "left" ? r.left : r.right) - box.left,
        y: r.top - box.top + r.height * (anchor.y ?? 0.5),
        onElement: true,
      };
    };

    const measure = () => {
      const box = container.getBoundingClientRect();
      const next: Line[] = [];
      for (const c of connections) {
        const from = resolve(c.from, box);
        const to = resolve(c.to, box);
        if (from && to) next.push({ from, to, group: c.group });
      }
      setLines(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    container.querySelectorAll("[data-anchor]").forEach((n) => ro.observe(n));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [connections]);

  // Active lines last so they draw over the inactive ones they cross.
  const ordered = [...lines].sort((a, b) => Number(a.group === active) - Number(b.group === active));

  return (
    <svg
      ref={svgRef}
      aria-hidden
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-visible", className)}
    >
      {ordered.map((line, i) => (
        <NetworkConnection key={i} from={line.from} to={line.to} active={!!active && line.group === active} />
      ))}
      {ordered.flatMap((line, i) =>
        [line.from, line.to]
          .filter((p) => p.onElement)
          .map((p, j) => (
            <circle
              key={`${i}-${j}`}
              cx={p.x}
              cy={p.y}
              r={2.5}
              strokeWidth={1}
              className={cn(
                "fill-canvas transition-[stroke] duration-300",
                active && line.group === active ? "stroke-accent" : "stroke-secondary",
              )}
            />
          )),
      )}
    </svg>
  );
}
