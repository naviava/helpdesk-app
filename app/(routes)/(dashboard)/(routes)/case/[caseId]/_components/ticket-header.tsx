import { format } from "date-fns";
import StatusBadge from "@/components/status-badge";
import { serverClient } from "@/app/_trpc/server-client";

interface TicketHeaderProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default function TicketHeader({ ticket }: TicketHeaderProps) {
  return (
    <section className="mx-4 flex justify-between">
      <div>
        <h2 className="text-xl font-medium tracking-wide">{ticket.title}</h2>
        <p className="text-sm text-muted-foreground">
          Opened: {format(new Date(ticket.createdAt), "MMM dd yyyy @ hh:mm")}
        </p>
      </div>
      <StatusBadge status={ticket.status} />
    </section>
  );
}
