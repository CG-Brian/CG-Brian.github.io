import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type ContributionCalendar = {
  username: string;
  generatedAt: string;
  totalContributions: number;
  /** Weeks of up to seven days, oldest first; GitHub's own calendar shape. */
  weeks: ContributionDay[][];
};

const isDay = (d: unknown): d is ContributionDay =>
  typeof d === "object" &&
  d !== null &&
  typeof (d as ContributionDay).date === "string" &&
  Number.isInteger((d as ContributionDay).count) &&
  [0, 1, 2, 3, 4].includes((d as ContributionDay).level);

/**
 * Reads the snapshot written by scripts/fetch-contributions.mjs. Runs at build time only.
 * Returns null when the file is missing or malformed, so the page can show a fallback.
 */
export function getContributions(): ContributionCalendar | null {
  try {
    const file = path.join(process.cwd(), "data", "contributions.json");
    const data = JSON.parse(readFileSync(file, "utf8")) as ContributionCalendar;
    const valid =
      typeof data.username === "string" &&
      typeof data.generatedAt === "string" &&
      Number.isInteger(data.totalContributions) &&
      Array.isArray(data.weeks) &&
      data.weeks.length > 0 &&
      data.weeks.every((w) => Array.isArray(w) && w.every(isDay));
    return valid ? data : null;
  } catch {
    return null;
  }
}
