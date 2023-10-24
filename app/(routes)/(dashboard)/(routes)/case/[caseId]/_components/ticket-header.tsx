import StatusBadge from "@/components/status-badge";
import { serverClient } from "@/app/_trpc/server-client";
import { calculateOpenedDuration } from "@/lib/calc-open-duration";

interface TicketHeaderProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default function TicketHeader({ ticket }: TicketHeaderProps) {
  return (
    <section className="mx-4 flex justify-between gap-x-2">
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-wide">{ticket.title}</h2>
        <p className="text-sm text-muted-foreground">{`Opened ${calculateOpenedDuration(
          ticket.createdAt,
        )} ago`}</p>
      </div>
      <StatusBadge status={ticket.status} />
    </section>
  );
}
