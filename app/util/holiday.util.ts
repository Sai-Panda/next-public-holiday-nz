import { CountdownParts, Holiday } from "../types/holiday";

export type HolidayOccurrence = {
  holiday: Holiday;
  date: string;
};

const nzOffsetFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  timeZoneName: "shortOffset",
});

// Returns Pacific/Auckland UTC offset in minutes for a specific timestamp.
// Example outputs from Intl can be "GMT+12" (NZST) or "GMT+13" (NZDT).
const getNzOffsetMinutes = (timestamp: number) => {
  // Ask Intl for timezone parts and extract only the offset-like timezone name part.
  const timeZoneName = nzOffsetFormatter
    .formatToParts(new Date(timestamp))
    .find((part) => part.type === "timeZoneName")?.value;

  if (!timeZoneName) {
    throw new Error("Failed to resolve Pacific/Auckland offset");
  }

  // Parse strings like "GMT+12" or "GMT+13:00" into sign/hours/minutes.
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(timeZoneName);

  if (!match) {
    throw new Error(`Unexpected Pacific/Auckland offset format: ${timeZoneName}`);
  }

  // Convert parsed pieces into total signed minutes.
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");

  return sign * (hours * 60 + minutes);
};

const nzDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const getTime = (date: string) => {
  if (!nzDatePattern.test(date)) {
    return new Date(date).getTime();
  }

  const [year, month, day] = date.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day, 0, 0, 0);

  // The offset in effect at NZ local midnight can differ from the offset at
  // UTC midnight (12-13 hours earlier, same NZ date) whenever a DST
  // transition falls in between. Resolve once to get close, then re-resolve
  // at that candidate instant so the correct side of the transition is used.
  let time = utcMidnight - getNzOffsetMinutes(utcMidnight) * 60 * 1000;
  time = utcMidnight - getNzOffsetMinutes(time) * 60 * 1000;

  return time;
};

// The next NZ calendar date, as a date string. Deliberately calendar
// arithmetic (not `+ 86_400_000`): an NZ day is 23 or 25 hours across a DST
// transition, so adding milliseconds can land on the wrong date.
const nextNzDateString = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));

  return [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

export const getHolidayOccurrences = (holidays: Holiday[]) => {
  return holidays
    .flatMap((holiday) =>
      holiday.dates.map((date) => ({
        holiday,
        date,
      })),
    )
    .sort((first, second) => getTime(first.date) - getTime(second.date));
};

export const getUpcomingHolidayOccurrences = (
  holidays: Holiday[],
  now: number,
  limit: number,
) => {
  return getHolidayOccurrences(holidays)
    .filter((occurrence) => getTime(nextNzDateString(occurrence.date)) > now)
    .slice(0, limit);
};

export const getCountdownParts = (date: string, now: number): CountdownParts => {
  const diff = Math.max(0, getTime(date) - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: getTime(date) <= now,
  };
};

export const formatCountdownValues = (parts: CountdownParts) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [pad(parts.days), pad(parts.hours), pad(parts.minutes), pad(parts.seconds)];
};
