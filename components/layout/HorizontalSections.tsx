"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { sections } from "@/lib/portfolio-data";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { SectionNavigation } from "./SectionNavigation";
import { SiteNavigation } from "./SiteNavigation";

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/** True if something between the target and the track can itself scroll sideways (e.g. a wide code block). */
const scrollsHorizontally = (target: EventTarget | null, track: HTMLElement) => {
  for (let el = target instanceof Element ? target : null; el && el !== track; el = el.parentElement) {
    if (el.scrollWidth > el.clientWidth && /auto|scroll/.test(getComputedStyle(el).overflowX)) return true;
  }
  return false;
};

/**
 * Desktop: a native horizontal scroll-snap track of full-viewport sections.
 * Vertical wheel input is never intercepted, so it only ever scrolls a section's
 * own content; horizontal gestures, arrow keys and the nav move between sections.
 * Mobile: the same sections stacked in a normal vertical page.
 */
export function HorizontalSections({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reduceMotion = useReducedMotion();

  const getSections = () => Array.from(mainRef.current?.querySelectorAll<HTMLElement>(":scope > section") ?? []);

  const markActive = useCallback((index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
    const hash = index === 0 ? "" : `#${sections[index].id}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(window.history.state, "", hash || window.location.pathname);
    }
  }, []);

  const navigate = useCallback(
    (index: number, { focus = true } = {}) => {
      const main = mainRef.current;
      const list = getSections();
      const i = Math.max(0, Math.min(list.length - 1, index));
      const target = list[i];
      if (!main || !target) return;

      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
      if (window.matchMedia(DESKTOP_QUERY).matches) {
        main.scrollTo({ left: i * main.clientWidth, behavior });
      } else {
        target.scrollIntoView({ behavior, block: "start" });
      }
      markActive(i);
      if (focus) target.focus({ preventScroll: true });
    },
    [markActive, reduceMotion],
  );

  // Deep links such as /#projects (also used by "back" links on detail pages).
  useLayoutEffect(() => {
    const index = sections.findIndex((s) => `#${s.id}` === window.location.hash);
    if (index <= 0) return;
    const main = mainRef.current;
    if (main && window.matchMedia(DESKTOP_QUERY).matches) {
      main.scrollLeft = index * main.clientWidth;
    } else {
      getSections()[index]?.scrollIntoView({ block: "start" });
    }
    activeRef.current = index;
    // The hash only exists on the client, so it is read once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(index);
  }, []);

  // Track the active section.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    if (isDesktop) {
      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => markActive(Math.round(main.scrollLeft / main.clientWidth)));
      };
      // Keep the current section aligned when the viewport resizes.
      const ro = new ResizeObserver(() => {
        main.scrollLeft = activeRef.current * main.clientWidth;
      });
      ro.observe(main);
      main.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        main.removeEventListener("scroll", onScroll);
      };
    }

    const list = getSections();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) markActive(list.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    list.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isDesktop, markActive]);

  // Horizontal gestures: one deliberate sideways swipe moves exactly one section.
  // Native snapping alone springs back on short swipes and can skip sections on long
  // flings, so horizontal-dominant wheel input is paged here. Vertical-dominant input
  // is never touched, which keeps section scrolling fully native.
  useEffect(() => {
    const main = mainRef.current;
    if (!isDesktop || !main) return;

    let travel = 0;
    let locked = false;
    let idle = 0;

    const onWheel = (e: WheelEvent) => {
      // Shift + mouse wheel reports vertical delta on some platforms.
      const shiftOnly = e.shiftKey && e.deltaX === 0;
      const dx = shiftOnly ? e.deltaY : e.deltaX;
      const dy = shiftOnly ? 0 : e.deltaY;
      if (Math.abs(dx) <= Math.abs(dy) || scrollsHorizontally(e.target, main)) return;

      e.preventDefault();
      // The gesture (including trackpad momentum) ends after a short pause in events.
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        travel = 0;
        locked = false;
      }, 180);
      if (locked) return;

      travel += dx;
      if (Math.abs(travel) >= 24) {
        locked = true;
        navigate(activeRef.current + Math.sign(travel), { focus: false });
      }
    };

    main.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(idle);
      main.removeEventListener("wheel", onWheel);
    };
  }, [isDesktop, navigate]);

  // Keyboard: ←/→ change section; ↑/↓ scroll the current section if focus is outside it.
  useEffect(() => {
    if (!isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isEditable(e.target)) return;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(activeRef.current + (e.key === "ArrowRight" ? 1 : -1), { focus: false });
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const section = getSections()[activeRef.current];
        if (!section || section.contains(document.activeElement)) return;
        e.preventDefault();
        section.scrollBy({ top: e.key === "ArrowDown" ? 120 : -120, behavior: reduceMotion ? "auto" : "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop, navigate, reduceMotion]);

  return (
    <>
      <SiteNavigation variant="home" active={active} onNavigate={(i) => navigate(i)} />
      <main
        ref={mainRef}
        className="no-scrollbar relative max-lg:before:absolute max-lg:before:inset-y-0 max-lg:before:left-5 max-lg:before:w-px max-lg:before:bg-connection lg:flex lg:h-dvh lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:overflow-y-hidden lg:overscroll-x-contain"
      >
        {children}
      </main>
      <SectionNavigation active={active} onNavigate={(i) => navigate(i)} />
    </>
  );
}
