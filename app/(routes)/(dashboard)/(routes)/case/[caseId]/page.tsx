import { redirect } from "next/navigation";

import PriorityTag from "@/components/priority-tag";
import TicketActions from "./_components/ticket-actions";
import TicketDetails from "./_components/ticket-details";
import TicketHeader from "./_components/ticket-header";

import { serverClient } from "@/app/_trpc/server-client";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });

  if (!ticket) return redirect("/");

  return (
    <div className="h-full lg:flex">
      <div className="w-full space-y-4 border-b border-r border-b-neutral-300 bg-slate-50 lg:inset-y-0 lg:h-full lg:w-[20rem] lg:border-r-neutral-300 xl:w-[30rem]">
        <div className="flex items-center justify-between p-4">
          <PriorityTag priority={ticket.priority} />
          <TicketActions initialData={ticket} />
        </div>
        <TicketHeader ticket={ticket} />
        <div className="border-t border-t-neutral-300 p-2">
          <TicketDetails ticket={ticket} />
        </div>
      </div>
      <div>TODO: Ticket Messages</div>
    </div>
  );
}
