import { getContributions, type ContributionDay } from "@/lib/contributions";
import { cn } from "@/lib/cn";

const levelClass: Record<ContributionDay["level"], string> = {
  0: "bg-border/70",
  1: "bg-accent/25",
  2: "bg-accent/50",
  3: "bg-accent/75",
  4: "bg-accent",
};

// Dates are calendar dates (YYYY-MM-DD); format them in UTC so they never shift by a day.
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

/**
 * GitHub contribution calendar for the trailing year, rendered at build time from the
 * snapshot in data/contributions.json. Columns are weeks, rows are weekdays (Sun–Sat).
 */
export function ContributionCalendar() {
  const data = getContributions();
  const profile = data ? `https://github.com/${data.username}` : "https://github.com/CG-Brian";

  if (!data) {
    return (
      <p className="mt-10 font-mono text-[11px] text-secondary">
        Contribution activity is on{" "}
        <a href={profile} target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:text-accent">
          GitHub
        </a>
        .
      </p>
    );
  }

  const days = data.weeks.flat();
  const first = days[0].date;
  const last = days.at(-1)!.date;
  const weekday = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay();

  // A month label sits above the first week that starts in a new month.
  const months = data.weeks.flatMap((week, i) => {
    const month = fmt(week[0].date, { month: "short" });
    const prev = i > 0 ? fmt(data.weeks[i - 1][0].date, { month: "short" }) : null;
    return month !== prev && i < data.weeks.length - 2 ? [{ column: i + 1, month }] : [];
  });

  const grid = { gridTemplateColumns: `repeat(${data.weeks.length}, minmax(0, 1fr))` };

  return (
    <section aria-labelledby="contributions-title" className="mt-10 w-full max-w-[600px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="contributions-title" className="font-mono text-[11px] uppercase tracking-[0.08em] text-secondary">
          A year in code
        </h2>
        <p className="font-mono text-[11px] text-secondary">
          <span className="text-ink">{data.totalContributions.toLocaleString("en-US")}</span> contributions &middot;{" "}
          {fmt(first, { month: "short", year: "numeric" })} – {fmt(last, { month: "short", year: "numeric" })}
        </p>
      </div>

      <div aria-hidden className="mt-3 hidden font-mono text-[9px] text-secondary sm:grid" style={grid}>
        {months.map((m) => (
          <span key={`${m.column}-${m.month}`} className="whitespace-nowrap" style={{ gridColumn: m.column }}>
            {m.month}
          </span>
        ))}
      </div>

      <div
        role="img"
        aria-label={`${data.totalContributions} GitHub contributions between ${fmt(first, { dateStyle: "long" })} and ${fmt(last, { dateStyle: "long" })}.`}
        className="mt-1 grid gap-[2px] sm:gap-[3px]"
        style={{ ...grid, gridTemplateRows: "repeat(7, auto)", gridAutoFlow: "column" }}
      >
        {data.weeks.flatMap((week, w) =>
          week.map((d) => (
            <span
              key={d.date}
              title={`${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${fmt(d.date, { dateStyle: "medium" })}`}
              className={cn("aspect-square rounded-[1px]", levelClass[d.level])}
              style={{ gridColumn: w + 1, gridRow: weekday(d.date) + 1 }}
            />
          )),
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] text-secondary">
        <span>
          <a href={profile} target="_blank" rel="noreferrer" className="hover:text-accent">
            github.com/{data.username} <span aria-hidden>&#8599;</span>
          </a>{" "}
          &middot; updated {fmt(data.generatedAt, { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className="inline-flex items-center gap-1" aria-hidden>
          Less
          {([0, 1, 2, 3, 4] as const).map((l) => (
            <span key={l} className={cn("size-[9px] rounded-[1px]", levelClass[l])} />
          ))}
          More
        </span>
      </div>
    </section>
  );
}
