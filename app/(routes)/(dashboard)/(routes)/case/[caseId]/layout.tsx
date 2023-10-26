import { redirect } from "next/navigation";

import PriorityTag from "@/components/priority-tag";
import ActionsBar from "./_components/ticket-actions/actions-bar";
import TicketDetails from "./_components/ticket-details";
import TicketHeader from "./_components/ticket-header";

import { serverClient } from "@/app/_trpc/server-client";
import StatusToggleButton from "./_components/ticket-actions/status-toggle-button";

interface CaseIdLayoutProps {
  children: React.ReactNode;
  params: { caseId: string };
}

export default async function CaseIdLayout({
  children,
  params,
}: CaseIdLayoutProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });
  if (!ticket) return redirect("/");

  const isResolved = ticket.status === "RESOLVED";
  const isOnHold = ticket.status === "ON_HOLD";
  const newStatus = !isResolved ? "RESOLVED" : "REOPENED";
  const statusToggleText = !isResolved ? "Close" : "Re-open";

  return (
    <div className="h-full lg:flex">
      <div className="w-full space-y-4 border-b border-r border-b-neutral-300 bg-slate-50 lg:inset-y-0 lg:h-full lg:w-[20rem] lg:border-r-neutral-300 xl:w-[30rem]">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <PriorityTag priority={ticket.priority} />
          <div className="space-x-2">
            {!isResolved && !isOnHold && (
              <StatusToggleButton
                ticketId={ticket.id}
                newStatus="ON_HOLD"
                text="Hold"
              />
            )}
            <StatusToggleButton
              ticketId={ticket.id}
              newStatus={newStatus}
              text={statusToggleText}
              className="bg-emerald-500 text-white"
            />
          </div>
        </div>
        <TicketHeader ticket={ticket} />
        <div className="border-t border-t-neutral-300 p-2">
          {/* Contains "About ticket" and "Ticket logs" sections. */}
          <TicketDetails ticket={ticket} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-full flex-col gap-y-4 px-2 py-4">
          <ActionsBar ticket={ticket} />
          {children}
        </div>
      </div>
    </div>
  );
}
