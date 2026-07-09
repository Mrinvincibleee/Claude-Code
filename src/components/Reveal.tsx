"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Single subtle fade-up per section: 12px travel, fires once.
 *
 * Progressive enhancement: the server renders content fully visible (no
 * blank sections for crawlers, no-JS visitors, or slow connections). After
 * hydration, sections still below the viewport are hidden and fade up when
 * scrolled into view. Reduced motion disables the effect entirely.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const hidden = hydrated && !inView && !prefersReducedMotion;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(12px)" : "none",
        transition: prefersReducedMotion
          ? undefined
          : "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
}
