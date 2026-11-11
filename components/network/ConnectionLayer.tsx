"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LAYER_INSET, type Annotation } from "@/lib/network";
import { NetworkConnection, type Point } from "./NetworkConnection";

/**
 * A point on the container's left/right edge, at a fraction of its height. With `inset`,
 * it sits `LAYER_INSET` inside that edge (a boundary layer column); with `node`, it is
 * drawn as a point.
 */
type EdgeAnchor = { edge: "left" | "right"; y: number; inset?: boolean; node?: boolean };
/** A side of an element marked with data-anchor="<el>", at a fraction of its height (default 0.5). */
type ElementAnchor = { el: string; side: "left" | "right"; y?: number };

export type Anchor = EdgeAnchor | ElementAnchor;

export type Connection = {
  from: Anchor;
  to: Anchor;
  /** Hover group: lines in the active group render in the accent colour. */
  group?: string;
  /**
   * weight: faint background edge between layer columns (opacity follows `weight`).
   * content: a link from content into the network. spine: the emphasised route.
   */
  tone?: "weight" | "content" | "spine";
  /** 0–1, only used by weight edges. */
  weight?: number;
  /** Skip this edge when the container is narrower than this (px). */
  minWidth?: number;
};

type Resolved = Point & { dot: boolean };
type Line = { from: Resolved; to: Resolved; group?: string; tone: NonNullable<Connection["tone"]>; weight: number };
type Placed = Annotation & { x: number; py: number };

type Props = {
  /** Keep this array stable (module-level or memoized); it drives re-measurement. */
  connections: readonly Connection[];
  /** Decorative notes placed along a boundary column. Keep stable, like `connections`. */
  annotations?: readonly Annotation[];
  /** Group whose lines render in the accent colour. */
  active?: string | null;
  className?: string;
};

const NO_ANNOTATIONS: readonly Annotation[] = [];

/**
 * Decorative SVG layer that draws straight network edges between anchors inside its
 * parent. The parent must be positioned; the layer sits behind content, ignores the
 * pointer and is hidden from assistive technology.
 */
export function ConnectionLayer({ connections, annotations = NO_ANNOTATIONS, active = null, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [notes, setNotes] = useState<Placed[]>([]);
  // The spine takes the accent colour while this section is on screen.
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;

    const insetPx = (box: DOMRect) => Math.min(LAYER_INSET.max, box.width * LAYER_INSET.fraction);

    const resolve = (anchor: Anchor, box: DOMRect): Resolved | null => {
      if ("edge" in anchor) {
        const inset = anchor.inset ? insetPx(box) : 0;
        return {
          x: anchor.edge === "left" ? inset : box.width - inset,
          y: anchor.y * box.height,
          dot: !!anchor.node,
        };
      }
      const node = container.querySelector(`[data-anchor~="${anchor.el}"]`);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return {
        x: (anchor.side === "left" ? r.left : r.right) - box.left,
        y: r.top - box.top + r.height * (anchor.y ?? 0.5),
        dot: true,
      };
    };

    const measure = () => {
      const box = container.getBoundingClientRect();
      const next: Line[] = [];
      for (const c of connections) {
        if (c.minWidth && box.width < c.minWidth) continue;
        const from = resolve(c.from, box);
        const to = resolve(c.to, box);
        if (from && to) next.push({ from, to, group: c.group, tone: c.tone ?? "content", weight: c.weight ?? 1 });
      }
      setLines(next);
      setNotes(
        annotations.map((a) => {
          const inset = insetPx(box);
          return { ...a, x: a.edge === "left" ? inset : box.width - inset, py: a.y * box.height };
        }),
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    container.querySelectorAll("[data-anchor]").forEach((n) => ro.observe(n));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [connections, annotations]);

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    io.observe(container);
    return () => io.disconnect();
  }, []);

  // Faint weights first, then content links, then the spine, then any hovered group on top.
  const rank = (l: Line) => (active && l.group === active ? 3 : l.tone === "spine" ? 2 : l.tone === "content" ? 1 : 0);
  const ordered = [...lines].sort((a, b) => rank(a) - rank(b));

  // One point per node position, however many edges meet there.
  const dots = new Map<string, { p: Point; spine: boolean; hot: boolean }>();
  for (const l of ordered) {
    for (const p of [l.from, l.to]) {
      if (!p.dot) continue;
      const key = `${Math.round(p.x)}:${Math.round(p.y)}`;
      const prev = dots.get(key);
      dots.set(key, {
        p,
        spine: (prev?.spine ?? false) || l.tone === "spine",
        hot: (prev?.hot ?? false) || (!!active && l.group === active),
      });
    }
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-visible", className)}
    >
      {ordered.map((line, i) => (
        <NetworkConnection
          key={i}
          from={line.from}
          to={line.to}
          tone={
            active && line.group === active
              ? "active"
              : line.tone === "spine"
                ? inView
                  ? "spine"
                  : "content"
                : line.tone
          }
          weight={line.weight}
        />
      ))}
      {[...dots.values()].map(({ p, spine, hot }) => (
        <circle
          key={`${Math.round(p.x)}:${Math.round(p.y)}`}
          cx={p.x}
          cy={p.y}
          r={2.25}
          strokeWidth={1}
          className={cn(
            "fill-canvas transition-[stroke] duration-500",
            hot || (spine && inView) ? "stroke-accent" : "stroke-secondary/70",
          )}
        />
      ))}
      {notes.map((n) => (
        <text
          key={n.parts.map((p) => (typeof p === "string" ? p : "sub" in p ? p.sub : p.sup)).join("")}
          x={n.x}
          y={n.py}
          textAnchor={n.edge === "left" ? "start" : "end"}
          className="fill-secondary/80 font-mono text-[11px]"
        >
          {n.parts.map((p, i) =>
            typeof p === "string" ? (
              <tspan key={i}>{p}</tspan>
            ) : "sub" in p ? (
              <tspan key={i} baselineShift="sub" fontSize="8">
                {p.sub}
              </tspan>
            ) : (
              <tspan key={i} baselineShift="super" fontSize="8">
                {p.sup}
              </tspan>
            ),
          )}
        </text>
      ))}
    </svg>
  );
}
