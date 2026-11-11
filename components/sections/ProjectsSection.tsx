import type { Connection } from "@/components/network/ConnectionLayer";
import { boundaryEdges, layerNode, spineIndex, type Annotation } from "@/lib/network";
import { CollectionSection } from "./CollectionSection";

// Purely visual: the layer arriving from Foundations converges on the first block, and the
// last block diverges into the layer leading to Research. No skill-to-project mapping.
const connections: Connection[] = [
  ...boundaryEdges("foundationsToProjects", "after"),
  ...[0, 1, 2, 3].map(
    (i): Connection => ({
      from: layerNode("foundationsToProjects", "after", i),
      to: { el: "first-block", side: "left", y: i < 2 ? 0.44 : 0.56 },
      tone: i === spineIndex.after ? "spine" : "content",
    }),
  ),
  ...[0, 1, 2, 3].map(
    (i): Connection => ({
      from: { el: "last-block", side: "right", y: i < 2 ? 0.44 : 0.56 },
      to: layerNode("projectsToResearch", "before", i),
      tone: i === spineIndex.before ? "spine" : "content",
    }),
  ),
  ...boundaryEdges("projectsToResearch", "before"),
];

const annotations: Annotation[] = [{ edge: "left", y: 0.2, parts: ["W ∈ ℝ", { sup: "m×n" }] }];

export function ProjectsSection() {
  return (
    <CollectionSection
      collection="projects"
      connections={connections}
      annotations={annotations}
      indexLabel="Case studies"
      writeupLabel="Case study"
    />
  );
}
