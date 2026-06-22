import { Holiday } from "../types/holiday";

export const getTime = (date: string) => new Date(date).getTime();

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
