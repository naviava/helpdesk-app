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
    return openedDuration === 1 ? "1 day ago" : `${openedDuration} days ago`;

  openedDuration = differenceInHours(Date.now(), date);
  if (openedDuration > 0)
    return openedDuration === 1 ? "1 hour ago" : `${openedDuration} hours ago`;

  openedDuration = differenceInMinutes(Date.now(), date);
  if (openedDuration > 0)
    return openedDuration === 1
      ? "1 minute ago"
      : `${openedDuration} minutes ago`;

  return "now";
}
