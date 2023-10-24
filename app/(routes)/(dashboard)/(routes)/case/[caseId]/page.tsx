import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./_components/message-input";
import MessageBox from "./_components/message-box";

import { serverClient } from "@/app/_trpc/server-client";
import StatusToggleButton from "./_components/status-toggle-button";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });

  const isResolved = ticket.status === "RESOLVED";
  const isOnHold = ticket.status === "ON_HOLD";
  const newStatus = !isResolved ? "RESOLVED" : "REOPENED";
  const statusToggleText = !isResolved ? "Mark as resolved" : "Re-open ticket";

  return (
    <div className="flex h-full flex-col gap-y-4 px-2 py-4">
      <div className="flex justify-end ">
        {!isResolved && !isOnHold && (
          <StatusToggleButton
            ticketId={ticket.id}
            newStatus="ON_HOLD"
            text="Place on hold"
          />
        )}
        <StatusToggleButton
          ticketId={ticket.id}
          newStatus={newStatus}
          text={statusToggleText}
        />
      </div>
      {ticket.messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          No messages yet.
        </div>
      )}
      {ticket.messages.length > 0 && (
        // <ScrollArea className="flex h-[40vh] flex-col md:h-[47vh] lg:h-[65vh] xl:h-[65vh]">
        <ScrollArea className="flex h-[75vh] flex-col">
          {ticket.messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              ticketOwnerId={ticket.owner.id}
            />
          ))}
        </ScrollArea>
      )}
      <MessageInput />
    </div>
  );
}
