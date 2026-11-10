"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { profile, sections } from "@/lib/portfolio-data";

type Props = {
  /** Index of the highlighted section, or null for none. */
  active: number | null;
  /** On the home page, section links scroll in place instead of reloading. */
  onNavigate?: (index: number) => void;
  /** "home" is fixed over the horizontal sections on desktop; "page" scrolls with the document. */
  variant?: "home" | "page";
};

export function SiteNavigation({ active, onNavigate, variant = "page" }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-canvas",
        variant === "home" && "lg:fixed lg:inset-x-0",
      )}
    >
      <div className="flex flex-col gap-0 px-5 pt-3 pb-0.5 sm:flex-row sm:items-center sm:justify-between lg:h-16 lg:px-16 lg:py-0">
        <Link
          href="/"
          onClick={(e) => {
            if (!onNavigate) return;
            e.preventDefault();
            onNavigate(0);
          }}
          className="inline-block py-1.5 text-[15px] font-medium tracking-[-0.01em] text-ink"
        >
          {profile.name}
        </Link>

        <nav aria-label="Sections">
          <ol className="flex flex-wrap gap-x-5 gap-y-1 lg:gap-x-8">
            {sections.map((s, i) => {
              const isActive = active === i;
              return (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      if (!onNavigate) return;
                      e.preventDefault();
                      onNavigate(i);
                    }}
                    className={cn(
                      "group inline-flex items-baseline gap-1.5 py-2.5 text-[13px] transition-colors lg:py-1",
                      isActive ? "text-ink" : "text-secondary hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "hidden font-mono text-[11px] sm:inline",
                        isActive ? "text-accent" : "text-secondary",
                      )}
                    >
                      {s.number}
                    </span>
                    <span
                      className={cn(
                        "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:transition-colors",
                        isActive ? "after:bg-accent" : "after:bg-transparent",
                      )}
                    >
                      <span className="sm:hidden">{s.short}</span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
