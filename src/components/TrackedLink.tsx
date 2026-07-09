"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type TrackedEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  event: TrackedEvent;
  eventData?: Record<string, string>;
  children: ReactNode;
}

/** Anchor that fires a named analytics event on click. */
export function TrackedLink({
  event,
  eventData,
  children,
  ...anchorProps
}: TrackedLinkProps) {
  return (
    <a {...anchorProps} onClick={() => trackEvent(event, eventData)}>
      {children}
    </a>
  );
}
