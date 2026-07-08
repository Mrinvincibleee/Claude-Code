"use client";

import { useEffect, useState } from "react";
import { getOpenStatusNow, type OpenStatus } from "@/lib/hours";

/**
 * Live open/closed indicator computed in the browser from the Asia/Karachi
 * hours config. The server renders a neutral state so there is never a
 * hydration mismatch or a stale cached answer.
 */
export function OpenNowBadge() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatusNow());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const dotColor =
    status === null
      ? "bg-steel/60"
      : status.isOpen
        ? "bg-rani"
        : "bg-steel";

  return (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-surface/80 px-4 py-1.5 text-sm text-cream"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`}
      />
      {status === null ? "Checking today's hours…" : status.label}
    </p>
  );
}
