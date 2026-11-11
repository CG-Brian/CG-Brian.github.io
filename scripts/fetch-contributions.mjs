// Fetches the public GitHub contribution calendar for the site owner at build time and
// writes it to data/contributions.json. Needs a token in CONTRIBUTIONS_TOKEN or
// GITHUB_TOKEN (GraphQL requires authentication). The token is only used here, on the
// build machine; it never reaches the client bundle or the written file.
// On any failure it keeps the existing file, so the site falls back to the last snapshot.
import { mkdir, writeFile } from "node:fs/promises";

const USERNAME = "CG-Brian";
const OUT = new URL("../data/contributions.json", import.meta.url);
const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const query = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

async function main() {
  const token = process.env.CONTRIBUTIONS_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("fetch-contributions: no token set; keeping the existing snapshot.");
    return;
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "portfolio-build" },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  });
  const body = await res.json();
  const calendar = body?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!res.ok || !calendar) {
    console.warn(`fetch-contributions: request failed (${res.status}); keeping the existing snapshot.`, body?.errors ?? "");
    return;
  }

  const data = {
    username: USERNAME,
    generatedAt: new Date().toISOString(),
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })),
    ),
  };
  await mkdir(new URL("../data/", import.meta.url), { recursive: true });
  await writeFile(OUT, JSON.stringify(data) + "\n");
  console.log(`fetch-contributions: ${data.totalContributions} contributions across ${data.weeks.length} weeks.`);
}

main().catch((err) => {
  console.warn("fetch-contributions: unexpected error; keeping the existing snapshot.", err.message);
});
