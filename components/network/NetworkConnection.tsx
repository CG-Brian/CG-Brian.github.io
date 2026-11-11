import { cn } from "@/lib/cn";

export type Point = { x: number; y: number };

type Props = {
  from: Point;
  to: Point;
  /**
   * weight: faint background edge, opacity scaled by `weight`.
   * content: a full-strength thin link. spine: the emphasised route. active: hovered group.
   */
  tone?: "weight" | "content" | "spine" | "active";
  weight?: number;
};

/** A straight edge, like a weighted connection between two network layers. */
export function NetworkConnection({ from, to, tone = "content", weight = 1 }: Props) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      strokeWidth={tone === "weight" ? 0.75 : 1}
      strokeOpacity={tone === "weight" ? 0.2 + 0.6 * weight : tone === "spine" ? 0.7 : 1}
      vectorEffect="non-scaling-stroke"
      className={cn(
        "transition-[stroke,stroke-opacity] duration-700",
        tone === "active" || tone === "spine" ? "stroke-accent" : "stroke-connection",
      )}
    />
  );
}
