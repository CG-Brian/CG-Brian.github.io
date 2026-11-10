import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  direction?: "forward" | "back";
  className?: string;
};

export function DetailLink({ href, children, direction = "forward", className }: Props) {
  const arrow = (
    <span
      aria-hidden
      className={cn(
        "transition-transform duration-200",
        direction === "forward" ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5",
      )}
    >
      {direction === "forward" ? "→" : "←"}
    </span>
  );

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-xs text-ink transition-colors hover:text-accent",
        className,
      )}
    >
      {direction === "back" && arrow}
      <span>{children}</span>
      {direction === "forward" && arrow}
    </Link>
  );
}
