import { format } from "date-fns";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";

import { serverClient } from "@/app/_trpc/server-client";

interface TicketsListProps {
  data: Awaited<
    ReturnType<
      (typeof serverClient)["ticket"][
        | "getUserTickets"
        | "getAllTickets"
        | "getAllOpenTickets"
        | "getAssignedTickets"]
    >
  >;
}

const priorityMap = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
};

export default async function TicketsList({ data }: TicketsListProps) {
  const user = await serverClient.user.getUserProfile();

  const ticketsData = data.map((ticket) => {
    return {
      ...ticket,
      priorityValue: priorityMap[ticket.priority],
      owner: ticket.owner.name,
      ownerEmail: ticket.owner.email,
      agent: ticket.agent?.name,
      agentEmail: ticket.agent?.email,
      currentUserRole: user?.role,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  });

  return <DataTable columns={columns} data={ticketsData} />;
}
