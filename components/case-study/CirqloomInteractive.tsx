"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import data from "./cirqloom-attention.json";
import { PanelLabel } from "./diagram-primitives";

const labels: Record<string, { name: string; rule: string }> = {
  previous_token_attention: { name: "Previous token", rule: "Each position attends to the one just before it: cells (q, q−1)." },
  first_token_attention: { name: "First token (BOS)", rule: "Each position attends to position 0, the first column." },
  induction_attention: {
    name: "Induction",
    rule: "In the second copy, each position attends to the token after its earlier occurrence: (q, q−9).",
  },
};

/**
 * Real attention for one example prompt, decoded from the committed float16 asset.
 * Fixed 0–1 scale for every head; future cells (k > q) are not attendable, not zero.
 */
export function AttentionMasks() {
  const [index, setIndex] = useState(2);
  const d = data.detectors[index];
  const meta = labels[d.id];
  const mask = useMemo(() => new Set(d.mask.map(([q, k]) => `${q}:${k}`)), [d]);
  const [cell, setCell] = useState<{ q: number; k: number } | null>(null);
  const size = d.attention.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Detector">
        {data.detectors.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setCell(null);
            }}
            className={cn(
              "rounded-[3px] border px-3 py-1.5 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              i === index ? "border-accent text-accent" : "border-border text-secondary hover:text-ink",
            )}
          >
            {labels[x.id].name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
        <div>
          <div
            role="img"
            aria-label={`${meta.name} detector on head ${d.head}: attention for one prompt with the detector's ${d.mask.length} scored cells outlined.`}
            className="grid w-full max-w-[336px] gap-px"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            onMouseLeave={() => setCell(null)}
          >
            {d.attention.flatMap((row, q) =>
              row.map((w, k) => {
                const future = k > q;
                const inMask = mask.has(`${q}:${k}`);
                return (
                  <span
                    key={`${q}-${k}`}
                    onMouseEnter={() => setCell({ q, k })}
                    className={cn("aspect-square", future ? "bg-border/50" : "bg-accent", inMask && "outline outline-1 outline-ink")}
                    style={future ? undefined : { opacity: Math.max(0.04, w) }}
                  />
                );
              }),
            )}
          </div>
          <div className="mt-3 flex max-w-[336px] flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] text-secondary">
            <span>rows: query &middot; columns: key</span>
            <span className="inline-flex items-center gap-1.5">
              0 <span aria-hidden className="inline-block h-2 w-10 bg-accent/10" />
              <span aria-hidden className="inline-block h-2 w-10 bg-accent" /> 1
            </span>
          </div>
        </div>

        <div>
          <PanelLabel>
            {meta.name} &middot; head {d.head}
          </PanelLabel>
          <p className="mt-3 text-sm leading-relaxed text-ink/85">{meta.rule}</p>
          <dl className="mt-5 space-y-2 text-[13px]">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-secondary">Scored cells (exported mask)</dt>
              <dd className="font-mono text-[12px] text-ink">{d.mask.length}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-secondary">Mean score, 8 prompts</dt>
              <dd className="font-mono text-[12px] text-ink">{d.meanScore.toFixed(3)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-secondary">Evidence status</dt>
              <dd className="font-mono text-[12px] text-secondary">experimental</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2" aria-live="polite">
              <dt className="text-secondary">Cell</dt>
              <dd className="font-mono text-[12px] text-ink">
                {cell
                  ? cell.k > cell.q
                    ? `q${cell.q} ← k${cell.k} · not attendable`
                    : `q${cell.q} ← k${cell.k} · ${d.attention[cell.q][cell.k].toFixed(2)}${mask.has(`${cell.q}:${cell.k}`) ? " · in mask" : ""}`
                  : "hover a cell"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-secondary">
            One prompt of eight, so these cells needn&rsquo;t average to the score. Grey cells are in the future and can&rsquo;t
            be attended to; they aren&rsquo;t zero.
          </p>
        </div>
      </div>
    </div>
  );
}
