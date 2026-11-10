import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Static export for GitHub Pages: `next build` writes plain HTML to `out/`.
  output: "export",
  // Each route becomes `route/index.html`, which GitHub Pages serves at `/route/`.
  trailingSlash: true,
  // GitHub Pages has no image optimization server.
  images: { unoptimized: true },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
