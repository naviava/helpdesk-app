import { ChevronDown, ChevronsUpDown, Settings2 } from "lucide-react";
import IconBadge from "@/components/icon-badge";
import { serverClient } from "@/app/_trpc/server-client";

interface TicketActionsProps {
  initialData: Awaited<
    ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>
  >;
}

export default function TicketActions({ initialData }: TicketActionsProps) {
  return (
    <div role="button" className="flex items-center gap-x-1">
      <ChevronsUpDown className="h-4 w-4" />
      <span className="text-sm">Options</span>
    </div>
  );
}
