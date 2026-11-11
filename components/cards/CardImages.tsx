"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CardImage } from "@/lib/images";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

const INTERVAL_MS = 4500;

type Props = {
  images: CardImage[];
  className?: string;
};

/**
 * The floating image in the upper part of a large block. Several images crossfade
 * slowly; under reduced motion, or with one image, the first stays put.
 */
export function CardImages({ images, className }: Props) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cycling = images.length > 1 && !reducedMotion;
  const [active, setActive] = useState(0);
  const shown = cycling ? active : 0;

  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [cycling, images.length]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px] border border-border bg-white shadow-[0_1px_2px_rgb(34_37_43/0.04),0_14px_32px_-20px_rgb(34_37_43/0.28)]",
        className,
      )}
    >
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          aria-hidden={i !== shown || undefined}
          fill
          sizes="(min-width: 1024px) 26vw, (min-width: 640px) 46vw, 92vw"
          className={cn(
            "transition-opacity duration-[1200ms] ease-in-out",
            img.fit === "contain" ? "object-contain p-3" : "object-cover",
            i === shown ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition: img.position }}
        />
      ))}
    </div>
  );
}
