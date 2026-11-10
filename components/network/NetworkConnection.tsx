import { cn } from "@/lib/cn";

export type Point = { x: number; y: number };

/** Cubic Bézier with horizontal tangents at both ends, so lines meet section edges flat. */
export function connectionPath(a: Point, b: Point) {
  const c = Math.max(32, Math.abs(b.x - a.x) * 0.5);
  return `M${a.x},${a.y} C${a.x + c},${a.y} ${b.x - c},${b.y} ${b.x},${b.y}`;
}

type Props = {
  from: Point;
  to: Point;
  active?: boolean;
};

export function NetworkConnection({ from, to, active = false }: Props) {
  return (
    <path
      d={connectionPath(from, to)}
      fill="none"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      className={cn(
        "transition-[stroke] duration-300",
        active ? "stroke-accent" : "stroke-connection",
      )}
    />
  );
}
