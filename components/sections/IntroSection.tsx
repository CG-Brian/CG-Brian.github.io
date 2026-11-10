import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { ConnectionLayer, type Connection } from "@/components/network/ConnectionLayer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { boundaries } from "@/lib/network";
import { profile } from "@/lib/portfolio-data";

const connections: Connection[] = [
  { from: { el: "portrait", side: "right" }, to: { edge: "right", y: boundaries.introToFoundations[0] } },
];

function Portrait() {
  return (
    <div
      data-anchor="portrait"
      className="relative aspect-[3/4] w-52 overflow-hidden rounded-[50%] border border-border bg-canvas sm:w-60 lg:h-[min(58vh,30rem)] lg:w-auto"
    >
      {profile.portrait ? (
        <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 1024px) 24rem, 15rem" className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 font-mono text-[11px] text-secondary">
          <span>portrait</span>
          <span>photo pending</span>
        </div>
      )}
    </div>
  );
}

export function IntroSection() {
  return (
    <Section id="introduction" labelledBy="intro-title">
      <ConnectionLayer connections={connections} className="hidden lg:block" />

      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-14 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-16 lg:pt-16">
        <div className="lg:col-span-7 xl:col-span-6">
          <SectionLabel number="01" label="Introduction" />
          <h1 id="intro-title" className="mt-8 text-4xl font-medium tracking-[-0.035em] sm:text-5xl xl:text-[64px] xl:leading-[1.02]">
            {profile.greeting}
          </h1>
          <p className="mt-6 max-w-[28ch] text-xl leading-snug tracking-[-0.012em] text-ink sm:text-2xl xl:text-[28px]">
            {profile.headline}
          </p>
          <p className="mt-6 max-w-[50ch] text-[15px] leading-relaxed text-secondary sm:text-base">{profile.background}</p>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {profile.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-ink underline decoration-border underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {link.label}
                    <span aria-hidden className="text-xs">&#8599;</span>
                  </a>
                ) : (
                  <span className="inline-flex items-baseline gap-2 text-sm text-secondary">
                    {link.label}
                    <span className="font-mono text-[10px]">link pending</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex lg:col-span-4 lg:col-start-9 lg:justify-center">
          <Portrait />
        </div>
      </div>
    </Section>
  );
}
