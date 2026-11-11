import type { Connection } from "@/components/network/ConnectionLayer";
import { boundaryEdges, layerNode, spineIndex, type Annotation } from "@/lib/network";
import { CollectionSection } from "./CollectionSection";

// The layer arriving from Projects converges on the first block; the network then ends on
// an open node beside the "future entries" note.
const connections: Connection[] = [
  ...boundaryEdges("projectsToResearch", "after"),
  ...[0, 1, 2, 3].map(
    (i): Connection => ({
      from: layerNode("projectsToResearch", "after", i),
      to: { el: "first-block", side: "left", y: i < 2 ? 0.44 : 0.56 },
      tone: i === spineIndex.after ? "spine" : "content",
    }),
  ),
  { from: { el: "last-block", side: "right", y: 0.5 }, to: { el: "next-slot", side: "left" } },
];

const annotations: Annotation[] = [{ edge: "left", y: 0.2, parts: ["Q = XW", { sub: "Q" }] }];

export function ResearchSection() {
  return (
    <CollectionSection
      collection="research"
      connections={connections}
      annotations={annotations}
      indexLabel="Research notes"
      writeupLabel="Write-up"
      emptyNote="Further entries will be added as the work develops."
    />
  );
}
