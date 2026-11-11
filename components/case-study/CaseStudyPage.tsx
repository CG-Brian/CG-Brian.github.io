import { notFound } from "next/navigation";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { DetailLink } from "@/components/ui/DetailLink";
import { HeroBackdrop } from "./HeroBackdrop";
import { collections, sections, type Collection } from "@/lib/portfolio-data";

type Props = {
  collection: Collection;
  slug: string;
  children: React.ReactNode;
};

/** Reusable case-study template for both project and research detail pages. */
export function CaseStudyPage({ collection, slug, children }: Props) {
  const { label, number, entries } = collections[collection];
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) notFound();

  const entry = entries[index];
  const prev = entries[index - 1];
  const next = entries[index + 1];

  return (
    <>
      <SiteNavigation active={sections.findIndex((s) => s.id === collection)} />

      <main className="mx-auto max-w-[1280px] px-5 pt-12 pb-32 lg:px-16 lg:pt-16">
        <a
          href={`/#${collection}`}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-secondary transition-colors hover:text-accent"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
          <span>
            {number} / {label}
          </span>
        </a>

        <header className="relative isolate mt-14 grid gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:gap-6">
          {entry.images?.hero && <HeroBackdrop image={entry.images.hero} />}
          <div className="lg:col-span-8">
            <p className="font-mono text-xs text-secondary">
              <span className="text-accent">{entry.id}</span>
              {entry.status && <span className="uppercase tracking-[0.06em]"> &middot; {entry.status}</span>}
            </p>
            <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">{entry.title}</h1>
            {entry.detail ? (
              <p className="mt-5 max-w-[34ch] text-xl leading-snug tracking-[-0.015em] text-ink/80 sm:text-2xl">
                {entry.detail.subtitle}
              </p>
            ) : (
              <p className="mt-4 text-lg tracking-[-0.01em] text-ink/80">{entry.category}</p>
            )}
          </div>
          {entry.detail ? (
            <dl className="space-y-4 lg:col-span-4 lg:self-end">
              {entry.detail.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">{f.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink/85">{f.value}</dd>
                </div>
              ))}
              {entry.links?.some((l) => l.href) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                  {entry.links.map(
                    (l) =>
                      l.href && (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 py-1 text-sm text-ink underline decoration-border underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                        >
                          {l.label}
                          <span aria-hidden className="text-xs">&#8599;</span>
                        </a>
                      ),
                  )}
                </div>
              )}
            </dl>
          ) : (
            <p className="max-w-[48ch] text-base leading-relaxed text-secondary lg:col-span-4 lg:self-end">
              {entry.description}
            </p>
          )}
        </header>

        <article className="mt-14 [counter-reset:cs] lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7 lg:col-start-4">{children}</div>
        </article>

        <nav aria-label={`More ${label.toLowerCase()}`} className="mt-28 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            {prev && (
              <DetailLink href={`/${collection}/${prev.slug}`} direction="back">
                {prev.id} &middot; {prev.title}
              </DetailLink>
            )}
          </div>
          <div className="sm:text-right">
            {next ? (
              <DetailLink href={`/${collection}/${next.slug}`}>
                {next.id} &middot; {next.title}
              </DetailLink>
            ) : (
              <a href={`/#${collection}`} className="font-mono text-xs text-secondary transition-colors hover:text-accent">
                All {label.toLowerCase()}
              </a>
            )}
          </div>
        </nav>
      </main>
    </>
  );
}
