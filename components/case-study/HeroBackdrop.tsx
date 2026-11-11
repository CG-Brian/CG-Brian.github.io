import Image from "next/image";
import type { HeroImage } from "@/lib/images";
import { cn } from "@/lib/cn";

type Props = { image: HeroImage };

/**
 * Atmospheric image behind a case-study hero. It sits inside the header, under the
 * text, and a radial mask fades every edge into the page so the title stays dominant.
 */
export function HeroBackdrop({ image }: Props) {
  const { mode = "side", opacity = 0.22, maskCenter = "50% 45%" } = image;
  // closest-side keeps the fade inside the layer, so no edge of the image is ever visible.
  const mask = `radial-gradient(closest-side at ${maskCenter}, #000 30%, transparent)`;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-14 bottom-0 -z-10 select-none opacity-60 sm:opacity-100",
        mode === "wide" ? "inset-x-0" : "right-0 left-0 sm:left-[20%] lg:left-[38%]",
      )}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <Image
        src={image.src}
        alt=""
        fill
        preload
        sizes="(min-width: 1280px) 800px, (min-width: 1024px) 62vw, 100vw"
        className="object-cover grayscale-[15%]"
        style={{ objectPosition: image.position, opacity }}
      />
    </div>
  );
}
