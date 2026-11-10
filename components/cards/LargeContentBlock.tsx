import Link from "next/link";
import type { Entry } from "@/lib/portfolio-data";

type Props = {
  entry: Entry;
  href: string;
};

/** Tall, bordered block used by both Projects and Research. The whole block is the link. */
export function LargeContentBlock({ entry, href }: Props) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-[20rem] flex-col rounded-[3px] border border-border bg-canvas p-6 transition-colors duration-200 hover:border-ink/40 xl:p-8"
    >
      <div className="flex items-start justify-between font-mono text-xs text-secondary">
        <span>{entry.id}</span>
        <span
          aria-hidden
          className="text-sm leading-none transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
        >
          &rarr;
        </span>
      </div>

      <div className="mt-auto pt-14">
        {entry.status && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">{entry.status}</p>
        )}
        <h3 className="text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-ink xl:text-[28px]">{entry.title}</h3>
        <p className="mt-3 text-sm leading-snug text-ink/80">{entry.category}</p>
        <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-secondary">{entry.description}</p>
      </div>
    </Link>
  );
}
