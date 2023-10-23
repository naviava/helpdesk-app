import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

export function calculateOpenedDuration(date: Date) {
  let openedDuration: number;

  openedDuration = differenceInCalendarDays(Date.now(), date);
  if (openedDuration > 0)
    return openedDuration === 1 ? "1 day" : `${openedDuration} days`;

  openedDuration = differenceInHours(Date.now(), date);
  if (openedDuration > 0)
    return openedDuration === 1 ? "1 hour" : `${openedDuration} hours`;

  openedDuration = differenceInMinutes(Date.now(), date);
  if (openedDuration > 0)
    return openedDuration === 1 ? "1 minute" : `${openedDuration} minutes`;

  return "now";
}
