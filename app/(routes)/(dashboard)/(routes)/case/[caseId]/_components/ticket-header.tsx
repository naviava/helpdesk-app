import StatusBadge from "@/components/status-badge";
import { serverClient } from "@/app/_trpc/server-client";
import OpenedDuration from "@/components/opened-duration";

interface TicketHeaderProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default function TicketHeader({ ticket }: TicketHeaderProps) {
  return (
    <section className="mx-4 flex justify-between">
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-wide">{ticket.title}</h2>
        <OpenedDuration
          date={ticket.createdAt}
          className="text-sm text-muted-foreground"
        />
      </div>
      <StatusBadge status={ticket.status} />
    </section>
  );
}
