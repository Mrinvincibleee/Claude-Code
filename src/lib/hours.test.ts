import { describe, expect, it } from "vitest";
import {
  formatMinutes,
  getOpenStatus,
  getOpenStatusNow,
  localDayAndMinutes,
} from "./hours";

const DAY = { SUN: 0, TUE: 2, SAT: 6 } as const;

describe("getOpenStatus", () => {
  it("is open on Tuesday at 3 AM (24-hour day)", () => {
    const status = getOpenStatus(DAY.TUE, 3 * 60);
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Open now · 24 hours");
  });

  it("is closed on Saturday at 10 AM, opening at 5 PM", () => {
    const status = getOpenStatus(DAY.SAT, 10 * 60);
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Opens at 5:00 PM");
  });

  it("is open on Saturday at 6 PM until midnight", () => {
    const status = getOpenStatus(DAY.SAT, 18 * 60);
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Open now · till 12:00 AM");
  });

  it("is open again from midnight on Sunday", () => {
    const status = getOpenStatus(DAY.SUN, 0);
    expect(status.isOpen).toBe(true);
  });

  it("treats one minute before Saturday opening as closed", () => {
    expect(getOpenStatus(DAY.SAT, 17 * 60 - 1).isOpen).toBe(false);
    expect(getOpenStatus(DAY.SAT, 17 * 60).isOpen).toBe(true);
  });
});

describe("localDayAndMinutes", () => {
  it("converts UTC to Asia/Karachi (+05:00)", () => {
    // 2026-07-07 is a Tuesday. 22:00 UTC = 03:00 Wednesday in Karachi.
    const { dayIndex, minutesAfterMidnight } = localDayAndMinutes(
      new Date("2026-07-07T22:00:00Z")
    );
    expect(dayIndex).toBe(3); // Wednesday
    expect(minutesAfterMidnight).toBe(3 * 60);
  });

  it("handles midnight in Karachi", () => {
    // 19:00 UTC = 00:00 Karachi next day.
    const { dayIndex, minutesAfterMidnight } = localDayAndMinutes(
      new Date("2026-07-10T19:00:00Z") // Friday 19:00 UTC → Saturday 00:00 PKT
    );
    expect(dayIndex).toBe(6); // Saturday
    expect(minutesAfterMidnight).toBe(0);
  });
});

describe("getOpenStatusNow", () => {
  it("is closed on a Saturday morning in Karachi", () => {
    // Saturday 2026-07-11 10:00 PKT = 05:00 UTC.
    const status = getOpenStatusNow(new Date("2026-07-11T05:00:00Z"));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Opens at 5:00 PM");
  });

  it("is open on a Saturday evening in Karachi", () => {
    // Saturday 2026-07-11 18:00 PKT = 13:00 UTC.
    const status = getOpenStatusNow(new Date("2026-07-11T13:00:00Z"));
    expect(status.isOpen).toBe(true);
  });
});

describe("formatMinutes", () => {
  it("formats key times", () => {
    expect(formatMinutes(0)).toBe("12:00 AM");
    expect(formatMinutes(17 * 60)).toBe("5:00 PM");
    expect(formatMinutes(12 * 60)).toBe("12:00 PM");
    expect(formatMinutes(9 * 60 + 5)).toBe("9:05 AM");
  });
});
