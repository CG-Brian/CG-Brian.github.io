import type { Connection } from "@/components/network/ConnectionLayer";
import { boundaries } from "@/lib/network";
import { CollectionSection } from "./CollectionSection";

const [a, b, c] = boundaries.foundationsToProjects;
const [x, y] = boundaries.projectsToResearch;

// Purely visual: three lines arrive from Foundations, cross and converge into the
// first block, and two leave the last block toward Research. No skill-to-project mapping.
const connections: Connection[] = [
  { from: { edge: "left", y: a }, to: { el: "first-block", side: "left", y: 0.56 } },
  { from: { edge: "left", y: b }, to: { el: "first-block", side: "left", y: 0.44 } },
  { from: { edge: "left", y: c }, to: { el: "first-block", side: "left", y: 0.56 } },
  { from: { el: "last-block", side: "right", y: 0.44 }, to: { edge: "right", y: x } },
  { from: { el: "last-block", side: "right", y: 0.56 }, to: { edge: "right", y: y } },
];

export function ProjectsSection() {
  return (
    <CollectionSection collection="projects" connections={connections} indexLabel="Case studies" writeupLabel="Case study" />
  );
}
