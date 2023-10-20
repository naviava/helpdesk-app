"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

interface TicketsListProps {}

export default function TicketsList({}: TicketsListProps) {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    trpc.ticket.getAllTickets.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      },
    );

  const tickets = data?.pages.flatMap((page) => page.tickets);

  return <div className="flex h-full flex-1 flex-col">TicketsList</div>;
}
