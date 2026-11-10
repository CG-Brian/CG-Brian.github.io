import { cn } from "@/lib/cn";

type Props = {
  number: string;
  label: string;
  as?: "p" | "h2";
  id?: string;
  className?: string;
};

/** Mono "03 / PROJECTS" label. On mobile it also marks the section on the vertical spine. */
export function SectionLabel({ number, label, as: Tag = "p", id, className }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative font-mono text-xs font-normal uppercase tracking-[0.08em] text-secondary",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1/2 -left-[31px] size-[7px] -translate-y-1/2 rounded-full border border-secondary bg-canvas lg:hidden"
      />
      <span className="text-accent">{number}</span> / {label}
    </Tag>
  );
}
