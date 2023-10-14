"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

interface TicketsListProps {}

export default function TicketsList({}: TicketsListProps) {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    trpc.getAllTickets.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      },
    );

  const tickets = data?.pages.flatMap((page) => page.tickets);

  return <div className="flex flex-1 flex-col justify-end">TicketsList</div>;
}
