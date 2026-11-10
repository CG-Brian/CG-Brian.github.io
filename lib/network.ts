/**
 * Boundary anchors: where connection lines cross from one section into the next,
 * as fractions of the section height. A line leaving one section's right edge at
 * a given fraction re-enters the next section's left edge at the same fraction,
 * which keeps the network continuous at any viewport size.
 */
export const boundaries = {
  introToFoundations: [0.5],
  foundationsToProjects: [0.38, 0.5, 0.62],
  projectsToResearch: [0.44, 0.56],
} as const;
