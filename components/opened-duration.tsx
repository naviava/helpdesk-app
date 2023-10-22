import { calculateOpenedDuration } from "@/lib/calc-open-duration";

interface OpenedDurationProps {
  date: Date;
  className?: string;
}

export default function OpenedDuration({
  date,
  className,
}: OpenedDurationProps) {
  const openedDurationDisplayString = `Opened ${calculateOpenedDuration(
    date,
  )} ago`;

  return <p className={className}>{openedDurationDisplayString}</p>;
}
