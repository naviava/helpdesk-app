import { format } from "date-fns";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";

import { serverClient } from "@/app/_trpc/server-client";
import { calculateOpenedDuration } from "@/lib/calc-open-duration";

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

export default async function TicketsList({ data }: TicketsListProps) {
  const user = await serverClient.user.getUserProfile();

  const ticketsData = data.map((ticket) => {
    return {
      ...ticket,
      category: ticket.category?.name,
      department: ticket.department?.name,
      owner: ticket.user.name,
      ownerEmail: ticket.user.email,
      agent: ticket.agent?.name,
      agentEmail: ticket.agent?.email,
      currentUserRole: user?.role,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  });

  return <DataTable columns={columns} data={ticketsData} />;
}
