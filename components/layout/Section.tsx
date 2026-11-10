import { cn } from "@/lib/cn";
import type { SectionId } from "@/lib/portfolio-data";

type Props = {
  id: SectionId;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * One layer of the journey. On desktop it is a full-viewport horizontal slide whose
 * own content scrolls vertically when it overflows; on mobile it is a normal block
 * in a vertical page, indented to sit beside the spine line.
 */
export function Section({ id, labelledBy, children, className }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={cn(
        "relative scroll-mt-24 outline-none",
        "max-lg:pt-16 max-lg:pb-20 max-lg:pr-5 max-lg:pl-12",
        "thin-scrollbar lg:h-full lg:w-full lg:flex-none lg:snap-start lg:snap-always lg:overflow-x-hidden lg:overflow-y-auto",
        className,
      )}
    >
      {children}
    </section>
  );
}
