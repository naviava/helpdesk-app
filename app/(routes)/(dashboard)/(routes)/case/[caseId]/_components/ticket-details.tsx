import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AboutTicket from "./about-ticket";
import TicketLogs from "./ticket-logs";

import { serverClient } from "@/app/_trpc/server-client";

interface TicketDetailsProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <Accordion type="multiple">
      {/* About ticket. */}
      <AccordionItem value="about-ticket">
        <AccordionTrigger className="text-sm">
          About this ticket
        </AccordionTrigger>
        <AccordionContent className="font-normal">
          <AboutTicket ticket={ticket} />
        </AccordionContent>
      </AccordionItem>
      {/* Ticket logs. */}
      <AccordionItem value="ticket-logs">
        <AccordionTrigger className="text-sm">Ticket Logs</AccordionTrigger>
        <AccordionContent className="font-normal">
          <TicketLogs ticketId={ticket.id} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
