import { Loader } from "lucide-react";

import PageHeading from "@/components/page-heading";
import TicketsList from "@/components/tickets-list";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

interface MyTicketsPageProps {}

export default function MyTicketsPage({}: MyTicketsPageProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeading
          title="My Tickets"
          tagline="All your unresolved tickets are displayed here"
        />
        <div>TODO: Search bar</div>
      </div>
      <TicketsList />
    </>
  );
}
