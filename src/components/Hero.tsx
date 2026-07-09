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
      className="pointer-events-none absolute -top-10 left-1/2 h-20 w-52 -translate-x-1/2"
      aria-hidden="true"
    >
      <g fill="none" stroke="#F4EADB" strokeLinecap="round" strokeWidth="3">
        <path
          className="steam-wisp"
          d="M60 70 C55 58 68 52 62 40 C57 30 66 24 63 14"
          style={{ filter: "blur(3.5px)" }}
        />
        <path
          className="steam-wisp"
          d="M100 74 C94 60 108 54 101 40 C95 28 106 22 102 10"
          style={{ filter: "blur(4.5px)" }}
        />
        <path
          className="steam-wisp"
          d="M140 70 C136 60 148 52 142 42 C136 32 146 26 142 16"
          style={{ filter: "blur(3.5px)" }}
        />
      </g>
    </svg>
  );
}

/**
 * Orchestrated load: lockup fades up → steam drifts → CTAs slide in,
 * all under 1.2s. Implemented as pure CSS animations (`.hero-enter-*`)
 * so the sequence starts on first paint — no JS on the critical path
 * and no LCP penalty. prefers-reduced-motion skips the choreography.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center"
    >
      {/* Warm lamp-glow against the midnight background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chai/10 blur-3xl"
      />

      <div className="hero-enter relative">
        <Steam />
        <h1 className="font-display">
          <span
            lang="ur"
            dir="rtl"
            className="urdu-lockup block text-6xl text-cream sm:text-7xl md:text-8xl"
          >
            {business.nameUrdu}
          </span>
          <span className="sr-only">
            {business.name} — {business.tagline}
          </span>
        </h1>
      </div>

      <p
        aria-hidden="true"
        className="hero-enter-delayed mt-2 font-display text-2xl font-semibold tracking-tight text-chai sm:text-3xl"
      >
        {business.tagline}
      </p>

      <p className="hero-enter-delayed mt-3 max-w-md text-balance text-steel">
        Doodh patti brewed all night at {business.address.street},{" "}
        {business.address.area}.
      </p>

      <div className="hero-enter-late mt-8 flex flex-col items-center gap-4">
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
      </div>
    </section>
  );
}
