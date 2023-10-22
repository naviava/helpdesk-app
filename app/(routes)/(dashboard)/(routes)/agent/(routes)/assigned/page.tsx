import { serverClient } from "@/app/_trpc/server-client";
import PageHeading from "@/components/page-heading";
import TicketsList from "@/components/tickets-list";

interface AgentAssignedPageProps {}

export default async function AgentAssignedPage({}: AgentAssignedPageProps) {
  const tickets = await serverClient.ticket.getAssignedTickets();

  return (
    <div className="px-2 py-6 md:p-6">
      <PageHeading
        title="Tickets Assigned to Me"
        tagline="Always check priority"
      />
      <TicketsList data={tickets} />
    </div>
  );
}
