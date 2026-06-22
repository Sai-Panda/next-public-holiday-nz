import { Holiday } from "../types/holiday";

const nzOffsetFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  timeZoneName: "shortOffset",
});

const getNzOffsetMinutes = (timestamp: number) => {
  const timeZoneName = nzOffsetFormatter
    .formatToParts(new Date(timestamp))
    .find((part) => part.type === "timeZoneName")?.value;

  if (!timeZoneName) {
    throw new Error("Failed to resolve Pacific/Auckland offset");
  }

  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(timeZoneName);

  if (!match) {
    throw new Error(`Unexpected Pacific/Auckland offset format: ${timeZoneName}`);
  }

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

export const getClosestUpcomingHolidayIndex = (holidays: Holiday[], now: number) => {
  let closestIndex = -1;
  let closestDiff = Number.POSITIVE_INFINITY;

  holidays.forEach((holiday, index) => {
    const diff = getTime(holiday.date) - now;
    if (diff > 0 && diff < closestDiff) {
      closestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
};

export const getHolidaysAfterDate = (date: string, holidays: Holiday[]) => {
    return holidays.filter((holiday) => new Date(holiday.date) > new Date(date))
}
