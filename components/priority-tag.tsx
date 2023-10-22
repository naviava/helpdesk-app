import { Priority } from "@prisma/client";
import { cn } from "@/lib/utils";

interface PriorityTagProps {
  priority: Priority;
}

const priorityColorMap = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-600",
  CRITICAL: "font-semibold text-fuchsia-700",
};

export default function PriorityTag({ priority }: PriorityTagProps) {
  if (priority === "CRITICAL") {
    return <span className={priorityColorMap[priority]}>**{priority}**</span>;
  } else {
    return (
      <div className="flex items-center gap-x-2">
        <div
          className={cn("h-2 w-2 rounded-full", priorityColorMap[priority])}
        />
        <span>{priority.charAt(0) + priority.slice(1).toLowerCase()}</span>
      </div>
    );
  }
}
