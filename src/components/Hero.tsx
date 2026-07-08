"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { business, whatsAppLink } from "@/data/business";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { TrackedLink } from "@/components/TrackedLink";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

/**
 * Steam wisps rising from the Nastaliq lockup. Pure CSS animation
 * (`.steam-wisp`); reduced-motion turns them into a static soft glow.
 */
function Steam() {
  return (
    <svg
      viewBox="0 0 200 80"
      className="pointer-events-none absolute -top-14 left-1/2 h-20 w-52 -translate-x-1/2"
      aria-hidden="true"
    >
      <g fill="none" stroke="#F4EADB" strokeLinecap="round" strokeWidth="3.5">
        <path
          className="steam-wisp"
          d="M60 70 C55 58 68 52 62 40 C57 30 66 24 63 14"
          style={{ filter: "blur(3px)" }}
        />
        <path
          className="steam-wisp"
          d="M100 74 C94 60 108 54 101 40 C95 28 106 22 102 10"
          style={{ filter: "blur(4px)" }}
        />
        <path
          className="steam-wisp"
          d="M140 70 C136 60 148 52 142 42 C136 32 146 26 142 16"
          style={{ filter: "blur(3px)" }}
        />
      </g>
    </svg>
  );
}

/**
 * Orchestrated load: lockup fades up → steam appears → CTAs slide in.
 * Whole sequence completes in under 1.2s. No choreography under
 * prefers-reduced-motion.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="hero"
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center"
      >
        {/* Warm lamp-glow against the midnight background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chai/10 blur-3xl"
        />

        <m.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <Steam />
          <h1 className="font-display">
            <span
              lang="ur"
              dir="rtl"
              className="block text-6xl font-medium text-cream sm:text-7xl md:text-8xl"
            >
              {business.nameUrdu}
            </span>
            <span className="sr-only">
              {business.name} — {business.tagline}
            </span>
          </h1>
        </m.div>

        <m.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
          aria-hidden="true"
          className="mt-6 font-display text-2xl font-semibold tracking-tight text-chai sm:text-3xl"
        >
          {business.tagline}
        </m.p>

        <m.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          className="mt-3 max-w-md text-balance text-steel"
        >
          Doodh patti brewed all night at {business.address.street},{" "}
          {business.address.area}.
        </m.p>

        <m.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <OpenNowBadge />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrackedLink
              event="whatsapp_click"
              eventData={{ source: "hero" }}
              href={whatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-chai px-6 text-base font-semibold text-bg transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Order on WhatsApp
            </TrackedLink>
            <TrackedLink
              event="call_click"
              eventData={{ source: "hero" }}
              href={`tel:${business.phone}`}
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-cream/25 px-6 text-base font-semibold text-cream transition-colors hover:border-cream/50"
            >
              <PhoneIcon className="h-5 w-5" />
              Call now
            </TrackedLink>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
