import { TicketStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
}

export const statusMap = {
  NEW: { colors: "bg-rose-500/20 text-rose-600", text: "New" },
  NEW_REPLY: {
    colors: "bg-fuchsia-500/20 text-fuchsia-600",
    text: "User reply",
  },
  WAITING_REPLY: {
    colors: "bg-blue-500/20 text-blue-600",
    text: "Waiting",
  },
  ON_HOLD: { colors: "bg-yellow-500/20 text-yellow-600", text: "On hold" },
  RESOLVED: { colors: "bg-emerald-500/20 text-emerald-600", text: "Resolved" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-fit shrink-0 select-none truncate",
        statusMap[status].colors,
      )}
    >
      <span>{statusMap[status].text}</span>
    </Badge>
  );
}
