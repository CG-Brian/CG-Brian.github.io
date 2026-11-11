// Converts one approved source image into the two web assets the image system uses:
//   public/images/<collection>/<slug>/<name>-card.webp  (floating card image)
//   public/images/<collection>/<slug>/<name>-hero.webp  (detail-page hero background)
// GitHub Pages serves images as-is (next.config sets `unoptimized`), so resizing happens here.
// Images are never enlarged. Reference the written paths in lib/portfolio-data.ts.
//
//   npm run image -- <source> <collection>/<slug> [name]
//   npm run image -- ~/Desktop/shot.png research/cirqloom explorer
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const VARIANTS = [
  { suffix: "card", width: 1200, quality: 82 },
  { suffix: "hero", width: 2400, quality: 74 },
];

async function main() {
  const [source, target, name = "main"] = process.argv.slice(2);
  if (!source || !target || !/^(projects|research)\/[a-z0-9-]+$/.test(target)) {
    console.error("usage: npm run image -- <source> <projects|research>/<slug> [name]");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "public", "images", target);
  await mkdir(outDir, { recursive: true });

  for (const { suffix, width, quality } of VARIANTS) {
    const file = path.join(outDir, `${name}-${suffix}.webp`);
    const info = await sharp(source)
      .rotate() // honour EXIF orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(file);
    console.log(`${path.relative(process.cwd(), file)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
