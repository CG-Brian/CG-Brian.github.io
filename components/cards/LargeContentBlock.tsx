import Link from "next/link";
import { CardImages } from "./CardImages";
import { cn } from "@/lib/cn";
import type { Entry } from "@/lib/portfolio-data";

type Props = {
  entry: Entry;
  href: string;
};

/**
 * Tall, bordered block used by both Projects and Research. The whole block is the link.
 * Optional images float in the upper whitespace; on desktop the block is a size container,
 * so the image takes a share of its height without changing the block's dimensions.
 */
export function LargeContentBlock({ entry, href }: Props) {
  const images = entry.images?.card;
  const hasImages = !!images?.length;

  return (
    <Link
      href={href}
      className="group flex h-full min-h-[20rem] flex-col rounded-[3px] border border-border bg-canvas p-6 transition-colors duration-200 hover:border-ink/40 lg:[container-type:size] xl:p-8"
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

      {hasImages && (
        <div className="flex items-start pt-8 lg:min-h-0 lg:flex-1 lg:pt-6">
          <CardImages images={images} className="aspect-[16/10] w-full lg:aspect-auto lg:h-[33cqh] lg:max-h-full" />
        </div>
      )}

      <div className={cn("mt-auto", hasImages ? "pt-8" : "pt-14")}>
        {entry.status && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">{entry.status}</p>
        )}
        <h3 className="text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-ink xl:text-[28px]">{entry.title}</h3>
        <p className="mt-3 text-sm leading-snug text-ink/80">{entry.category}</p>
        {/* On short desktop screens the block can't grow (it's height-locked to the slide), so clamp. */}
        <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-secondary lg:[@media(max-height:820px)]:line-clamp-4">
          {entry.description}
        </p>
      </div>
    </Link>
  );
}
