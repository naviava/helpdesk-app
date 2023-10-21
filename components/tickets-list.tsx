import { format } from "date-fns";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";

import { serverClient } from "@/app/_trpc/server-client";

export default async function TicketsList() {
  const user = await serverClient.user.getUserProfile();
  const tickets = await serverClient.ticket.getAllTickets();

  const ticketsData = tickets.map((ticket) => ({
    ...ticket,
    category: ticket.category?.name,
    department: ticket.department?.name,
    owner: ticket.user.name,
    ownerEmail: ticket.user.email,
    agent: ticket.agent?.name,
    agentEmail: ticket.agent?.email,
    currentUserRole: user?.role,
    createdAt: format(new Date(ticket.createdAt), "MMM dd, yy @ HH:mm"),
    updatedAt: format(new Date(ticket.updatedAt), "MMM dd, yy @ HH:mm"),
  }));

  return <DataTable columns={columns} data={ticketsData} />;
}
