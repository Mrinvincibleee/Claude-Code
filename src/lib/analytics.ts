"use client";

import { track } from "@vercel/analytics";

export type TrackedEvent =
  | "whatsapp_click"
  | "call_click"
  | "directions_click";

export function trackEvent(
  event: TrackedEvent,
  data?: Record<string, string>
): void {
  track(event, data);
}
