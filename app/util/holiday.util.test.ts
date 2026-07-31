import { describe, expect, it } from "vitest";
import { Holiday } from "../types/holiday";
import { holidays as realHolidays } from "../types/holidays";
import {
  formatCountdownValues,
  getCountdownParts,
  getHolidayOccurrences,
  getTime,
  getUpcomingHolidayOccurrences,
} from "./holiday.util";

// Formats a timestamp as NZ wall-clock time, independent of getTime's own
// implementation, so these tests can assert against Intl ground truth
// rather than hand-derived UTC offsets.
const nzWallClock = (timestamp: number) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp));

  const get = (type: string) => parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
};

const holiday = (name: string, dates: string[]): Holiday => ({
  name,
  dates,
  infoUrl: "https://example.com",
});

describe("getTime", () => {
  it("resolves an ordinary date to NZ local midnight", () => {
    expect(nzWallClock(getTime("2026-12-25"))).toBe("2026-12-25 00:00:00");
  });

  it("resolves the offset in effect at NZ local midnight across the DST-end transition (2026-04-05)", () => {
    expect(nzWallClock(getTime("2026-04-05"))).toBe("2026-04-05 00:00:00");
  });

  it("resolves the offset in effect at NZ local midnight across the DST-start transition (2026-09-27)", () => {
    expect(nzWallClock(getTime("2026-09-27"))).toBe("2026-09-27 00:00:00");
  });
});

describe("getUpcomingHolidayOccurrences", () => {
  const holidays: Holiday[] = [
    holiday("Christmas Day", ["2026-12-25"]),
    holiday("Boxing Day", ["2026-12-28"]),
  ];

  it("keeps today's holiday as the next occurrence for the whole NZ day it falls on", () => {
    const startOfDay = getTime("2026-12-25");
    const tenAm = startOfDay + 10 * 60 * 60 * 1000;
    const lastSecondOfDay = getTime("2026-12-26") - 1000;

    for (const now of [startOfDay, tenAm, lastSecondOfDay]) {
      const [next] = getUpcomingHolidayOccurrences(holidays, now, 1);
      expect(next.holiday.name).toBe("Christmas Day");
    }
  });

  it("moves on to the next holiday once NZ midnight passes on the day after", () => {
    const [next] = getUpcomingHolidayOccurrences(holidays, getTime("2026-12-26"), 1);
    expect(next.holiday.name).toBe("Boxing Day");
  });

  it("does not surface a holiday before its NZ day has started", () => {
    const justBefore = getTime("2026-12-25") - 1;
    const [next] = getUpcomingHolidayOccurrences(holidays, justBefore, 1);
    expect(next.holiday.name).toBe("Christmas Day");
  });
});

describe("getHolidayOccurrences", () => {
  it("sorts occurrences chronologically regardless of input order", () => {
    const holidays: Holiday[] = [
      holiday("Boxing Day", ["2026-12-28"]),
      holiday("Christmas Day", ["2026-12-25"]),
    ];

    const occurrences = getHolidayOccurrences(holidays);
    expect(occurrences.map((occurrence) => occurrence.holiday.name)).toEqual([
      "Christmas Day",
      "Boxing Day",
    ]);
  });
});

describe("getCountdownParts", () => {
  it("is not done while time remains", () => {
    const oneHourBefore = getTime("2026-12-25") - 60 * 60 * 1000;
    expect(getCountdownParts("2026-12-25", oneHourBefore).done).toBe(false);
  });

  it("becomes done at the exact start of the holiday's NZ day", () => {
    expect(getCountdownParts("2026-12-25", getTime("2026-12-25")).done).toBe(true);
  });

  it("stays done for the remainder of the holiday's NZ day", () => {
    const lastSecondOfDay = getTime("2026-12-26") - 1000;
    expect(getCountdownParts("2026-12-25", lastSecondOfDay).done).toBe(true);
  });

  it("clamps days/hours/minutes/seconds to zero once done, rather than going negative", () => {
    const wellAfter = getTime("2026-12-25") + 5 * 24 * 60 * 60 * 1000;
    const parts = getCountdownParts("2026-12-25", wellAfter);
    expect(parts).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });
});

describe("formatCountdownValues", () => {
  it("zero-pads every field, including when done", () => {
    const parts = getCountdownParts("2026-12-25", getTime("2026-12-25"));
    expect(formatCountdownValues(parts)).toEqual(["00", "00", "00", "00"]);
  });

  it("never renders the literal word 'Today'", () => {
    const parts = getCountdownParts("2026-12-25", getTime("2026-12-25"));
    expect(formatCountdownValues(parts)).not.toContain("Today");
  });
});

// Golden test: the "today" boundary must hold for every real hardcoded
// holiday occurrence (all 33 dates across 2026-2028), not just Christmas.
// This is deliberately independent of getTime/nextNzDateString internals —
// it derives the next calendar date with its own arithmetic so it verifies
// the observable contract, not the implementation.
const nextCalendarDateString = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));

  return [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

describe("today state across every real holiday occurrence", () => {
  const occurrences = getHolidayOccurrences(realHolidays);

  expect(occurrences.length).toBeGreaterThan(30);

  occurrences.forEach((occurrence, index) => {
    const label = `${occurrence.holiday.name} (${occurrence.date})`;
    const startOfDay = getTime(occurrence.date);
    const endOfDay = getTime(nextCalendarDateString(occurrence.date)) - 1;

    it(`${label}: is not yet done the instant before its NZ day starts`, () => {
      expect(getCountdownParts(occurrence.date, startOfDay - 1).done).toBe(false);
    });

    it(`${label}: becomes done at the exact start of its NZ day`, () => {
      expect(getCountdownParts(occurrence.date, startOfDay).done).toBe(true);
    });

    it(`${label}: stays done for the entire NZ day`, () => {
      expect(getCountdownParts(occurrence.date, endOfDay).done).toBe(true);
    });

    it(`${label}: is surfaced as the next occurrence throughout its own NZ day`, () => {
      for (const now of [startOfDay, endOfDay]) {
        const [next] = getUpcomingHolidayOccurrences(realHolidays, now, 1);
        expect(next?.holiday.name).toBe(occurrence.holiday.name);
        expect(next?.date).toBe(occurrence.date);
      }
    });

    it(`${label}: hands off correctly once its NZ day ends`, () => {
      const following = occurrences[index + 1];
      const [next] = getUpcomingHolidayOccurrences(realHolidays, endOfDay + 1, 1);

      if (following) {
        expect(next?.holiday.name).toBe(following.holiday.name);
        expect(next?.date).toBe(following.date);
      } else {
        // Last occurrence in the dataset: nothing left to hand off to.
        expect(next).toBeUndefined();
      }
    });
  });
});
