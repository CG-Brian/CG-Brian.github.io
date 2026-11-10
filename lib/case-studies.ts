import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Collection } from "./portfolio-data";

export type OutlineItem = { title: string; written: boolean };

/**
 * Reads a case study's `##` headings so section indexes can show what each
 * write-up covers. A section counts as written once it contains prose beyond
 * <Placeholder> and <Note> blocks, so the outline updates as content is added.
 */
export function getOutline(collection: Collection, slug: string): OutlineItem[] {
  const file = path.join(process.cwd(), "content", collection, `${slug}.mdx`);
  const source = readFileSync(file, "utf8");

  return source
    .split(/^## /m)
    .slice(1)
    .map((part) => {
      const [title, ...rest] = part.split("\n");
      const prose = rest
        .join("\n")
        .replace(/<(Placeholder|Note)>[\s\S]*?<\/\1>/g, "")
        .trim();
      return { title: title.trim(), written: prose.length > 0 };
    });
}
