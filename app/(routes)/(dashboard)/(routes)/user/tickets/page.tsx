import PageHeading from "@/components/page-heading";
import TicketsList from "@/components/tickets-list";

import { serverClient } from "@/app/_trpc/server-client";

export default async function MyTicketsPage() {
  const tickets = await serverClient.ticket.getUserTickets();

  return (
    <>
      <PageHeading
        title="My Tickets"
        tagline="All your unresolved tickets are displayed here"
      />
      <div className="mt-4">
        <TicketsList data={tickets} />
      </div>
    </>
  );
}
