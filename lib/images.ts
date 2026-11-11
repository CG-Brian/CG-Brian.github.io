/**
 * Optional imagery for a project or research entry. Every path points at a file
 * under /public that actually exists; generate them with `npm run image`.
 * An entry without `images`, or without one of its parts, renders the plain layout.
 */

export type ImageAsset = {
  /** Path under /public, e.g. "/images/research/cirqloom/explorer-card.webp". */
  src: string;
  alt: string;
  /** CSS object-position: which part survives the crop. Defaults to "center". */
  position?: string;
};

export type CardImage = ImageAsset & {
  /** "cover" crops to the frame (screenshots, photos); "contain" shows all of it (diagrams). */
  fit?: "cover" | "contain";
};

/** Decorative atmosphere behind the title, so it carries no alt text of its own. */
export type HeroImage = Omit<ImageAsset, "alt"> & {
  /** "side" sits behind the right of the hero; "wide" spans it. Defaults to "side". */
  mode?: "side" | "wide";
  /** Image opacity before masking, 0–1. Defaults to 0.22. */
  opacity?: number;
  /** Center of the soft mask, as a CSS position within the image layer. Defaults to "50% 45%". */
  maskCenter?: string;
};

export type EntryImages = {
  /** One image is static; several crossfade every few seconds (never under reduced motion). */
  card?: CardImage[];
  hero?: HeroImage;
};
