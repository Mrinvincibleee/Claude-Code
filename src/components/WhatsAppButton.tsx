"use client";

import { useEffect, useState } from "react";
import { whatsAppLink } from "@/data/business";
import { trackEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Floating WhatsApp button — mobile only, appears once the hero has been
 * scrolled past. The rani pulse ring is its attention cue.
 */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => trackEvent("whatsapp_click", { source: "floating" })}
      className={`whatsapp-pulse fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-bg transition-all duration-300 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
