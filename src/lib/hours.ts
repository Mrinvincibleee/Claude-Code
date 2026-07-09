import {
  business,
  dayNames,
  weeklyHours,
  type WeeklyHours,
} from "@/data/business";

export interface OpenStatus {
  isOpen: boolean;
  /** e.g. "Open now · 24 hours", "Open now · till 12:00 AM", "Opens at 5:00 PM" */
  label: string;
}

export function formatMinutes(minutesAfterMidnight: number): string {
  const total = minutesAfterMidnight % (24 * 60);
  const hours24 = Math.floor(total / 60);
  const minutes = total % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/**
 * Pure open/closed computation from a local day index (0 = Sunday) and
 * minutes after local midnight.
 */
export function getOpenStatus(
  dayIndex: number,
  minutesAfterMidnight: number,
  hours: WeeklyHours = weeklyHours
): OpenStatus {
  const today = hours[dayIndex];

  if (today === null) {
    return { isOpen: true, label: "Open now · 24 hours" };
  }

  if (
    minutesAfterMidnight >= today.open &&
    minutesAfterMidnight < today.close
  ) {
    const closeLabel =
      today.close === 24 * 60 ? "12:00 AM" : formatMinutes(today.close);
    return { isOpen: true, label: `Open now · till ${closeLabel}` };
  }

  if (minutesAfterMidnight < today.open) {
    return { isOpen: false, label: `Opens at ${formatMinutes(today.open)}` };
  }

  // After today's closing time: find the next day with hours.
  for (let offset = 1; offset <= 7; offset++) {
    const nextIndex = (dayIndex + offset) % 7;
    const next = hours[nextIndex];
    if (next === null) {
      return {
        isOpen: false,
        label: `Opens ${dayNames[nextIndex]} at 12:00 AM`,
      };
    }
    if (next) {
      return {
        isOpen: false,
        label: `Opens ${dayNames[nextIndex]} at ${formatMinutes(next.open)}`,
      };
    }
  }

  return { isOpen: false, label: "Closed" };
}

/** Extracts the local day index and minutes-after-midnight in a timezone. */
export function localDayAndMinutes(
  date: Date,
  timezone: string = business.timezone
): { dayIndex: number; minutesAfterMidnight: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    get("weekday")
  );
  // Intl may report midnight as "24" with hour12: false in some engines.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  return { dayIndex, minutesAfterMidnight: hour * 60 + minute };
}

export function getOpenStatusNow(date: Date = new Date()): OpenStatus {
  const { dayIndex, minutesAfterMidnight } = localDayAndMinutes(date);
  return getOpenStatus(dayIndex, minutesAfterMidnight);
}
