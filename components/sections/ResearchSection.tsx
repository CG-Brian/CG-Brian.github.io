import type { Connection } from "@/components/network/ConnectionLayer";
import { boundaries } from "@/lib/network";
import { CollectionSection } from "./CollectionSection";

const [x, y] = boundaries.projectsToResearch;

// The two lines leaving Projects re-enter here at the same heights and ports they
// left from, then the network ends on an open node beside the "future entries" note.
const connections: Connection[] = [
  { from: { edge: "left", y: x }, to: { el: "first-block", side: "left", y: 0.44 } },
  { from: { edge: "left", y: y }, to: { el: "first-block", side: "left", y: 0.56 } },
  { from: { el: "last-block", side: "right", y: 0.5 }, to: { el: "next-slot", side: "left" } },
];

export function ResearchSection() {
  return (
    <CollectionSection
      collection="research"
      connections={connections}
      indexLabel="Research notes"
      writeupLabel="Write-up"
      emptyNote="Further entries will be added as the work develops."
    />
  );
}
