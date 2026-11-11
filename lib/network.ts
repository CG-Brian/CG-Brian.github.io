import type { Anchor, Connection } from "@/components/network/ConnectionLayer";

/**
 * Layered network geometry. Every section boundary carries three columns of nodes, at
 * fractions of the section height:
 *
 *   before  – just inside the earlier section, `LAYER_INSET` from its right edge
 *   edge    – on the shared edge itself (drawn by both sections, so it lines up exactly)
 *   after   – just inside the later section, `LAYER_INSET` from its left edge
 *
 * Straight weighted edges connect neighbouring nodes of adjacent columns, so the network
 * reads as before → edge → after across the boundary at any viewport size. Everything is
 * derived from these constants with a deterministic hash: no randomness at render time.
 */
export const boundaryLayers = {
  introToFoundations: {
    before: [0.36, 0.46, 0.56, 0.66],
    edge: [0.31, 0.41, 0.51, 0.61, 0.71],
    after: [0.38, 0.48, 0.58, 0.68],
  },
  foundationsToProjects: {
    before: [0.4, 0.5, 0.6, 0.7],
    edge: [0.35, 0.45, 0.55, 0.65, 0.75],
    after: [0.36, 0.46, 0.56, 0.66],
  },
  projectsToResearch: {
    before: [0.36, 0.46, 0.56, 0.66],
    edge: [0.31, 0.41, 0.51, 0.61, 0.71],
    after: [0.36, 0.46, 0.56, 0.66],
  },
} as const;

export type BoundaryName = keyof typeof boundaryLayers;

/** Distance of the inner columns from the edge: a fraction of the width, capped in px. */
export const LAYER_INSET = { fraction: 0.042, max: 76 };

/** Below this width, the faintest weight edges are dropped to keep narrow layouts quiet. */
const DENSE_MIN_WIDTH = 1200;

/** The emphasised route through each boundary: before[1] → edge[2] → after[1]. */
const SPINE = { before: 1, edge: 2, after: 1 } as const;

// Small integer hash: the same inputs always give the same 0–1 value.
function hash01(...n: number[]) {
  let h = 2166136261;
  for (const v of n) h = Math.imul(h ^ (v + 0x9e3779b9), 16777619);
  return ((h >>> 0) % 10007) / 10007;
}

const seedOf = (name: BoundaryName) => Object.keys(boundaryLayers).indexOf(name) + 1;

/**
 * A column node, drawn as a point. The shared `edge` column is the right edge for the
 * section before the boundary and the left edge for the section after it, so `drawnBy`
 * says which section is drawing it.
 */
export const layerNode = (
  name: BoundaryName,
  column: "before" | "edge" | "after",
  i: number,
  drawnBy: "before" | "after" = column === "after" ? "after" : "before",
): Anchor => ({
  edge: drawnBy === "after" ? "left" : "right",
  y: boundaryLayers[name][column][i],
  inset: column !== "edge",
  node: true,
});

/**
 * Weighted edges between two adjacent columns. Pairs further apart than `reach` are never
 * connected (a banded weight matrix rather than a fully connected one); about a quarter
 * of the remaining pairs are omitted, and each kept edge gets a stable weight.
 */
function weightEdges(
  name: BoundaryName,
  from: "before" | "edge",
  to: "edge" | "after",
  reach = 0.16,
): Connection[] {
  const seed = seedOf(name);
  const a = boundaryLayers[name][from];
  const b = boundaryLayers[name][to];
  // The edge → after half is drawn by the later section, the before → edge half by the earlier one.
  const drawnBy = to === "after" ? "after" : "before";
  // Every node on the shared edge keeps its nearest edge on both sides, at every width,
  // so no line ever stops at a boundary without continuing into the next section.
  const nearest = (ys: readonly number[], y: number) =>
    ys.reduce((best, v, k) => (Math.abs(v - y) < Math.abs(ys[best] - y) ? k : best), 0);
  const anchorsEdge = (i: number, j: number) =>
    from === "edge" ? nearest(b, a[i]) === j : nearest(a, b[j]) === i;

  const out: Connection[] = [];
  a.forEach((ya, i) =>
    b.forEach((yb, j) => {
      const spine = SPINE[from] === i && SPINE[to] === j;
      const kept = spine || anchorsEdge(i, j);
      if (!kept && (Math.abs(ya - yb) > reach || hash01(seed, i, j, from.length) < 0.24)) return;
      const weight = spine ? 1 : 0.3 + 0.7 * hash01(seed, j, i, 7);
      out.push({
        from: layerNode(name, from, i, drawnBy),
        to: layerNode(name, to, j, drawnBy),
        tone: spine ? "spine" : "weight",
        weight,
        minWidth: !kept && weight < 0.45 ? DENSE_MIN_WIDTH : undefined,
      });
    }),
  );
  return out;
}

/** Edges a section draws for a boundary on its right (`before`) or left (`after`) side. */
export function boundaryEdges(name: BoundaryName, side: "before" | "after"): Connection[] {
  return side === "before" ? weightEdges(name, "before", "edge") : weightEdges(name, "edge", "after");
}

export const spineIndex = SPINE;

/** A short mathematical note aligned with a boundary column (decorative, aria-hidden). */
export type Annotation = {
  /** The note aligns with the layer column on this side, reading inward. */
  edge: "left" | "right";
  /** Baseline of the note, as a fraction of the section height. */
  y: number;
  parts: (string | { sub: string } | { sup: string })[];
};
