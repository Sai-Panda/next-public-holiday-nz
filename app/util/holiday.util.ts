import { Holiday } from "../types/holiday";

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
  const offsetMinutes = getNzOffsetMinutes(utcMidnight);

  return utcMidnight - offsetMinutes * 60 * 1000;
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
    .filter((occurrence) => getTime(occurrence.date) > now)
    .slice(0, limit);
};
