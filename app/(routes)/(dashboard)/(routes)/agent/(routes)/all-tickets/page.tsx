import { serverClient } from "@/app/_trpc/server-client";
import PageHeading from "@/components/page-heading";
import TicketsList from "@/components/tickets-list";

export default async function AllOpenTicketsPage() {
  const tickets = await serverClient.ticket.getAllOpenTickets();

  return (
    <div className="px-2 py-6 md:p-6">
      <PageHeading
        title="All Open Tickets"
        tagline="Assign any unassigned tickets ASAP"
      />
      <div className="mt-4">
        <TicketsList data={tickets} />
      </div>
    </div>
  );
}
