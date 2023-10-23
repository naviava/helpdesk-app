import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./_components/message-input";
import MessageBox from "./_components/message-box";

import { serverClient } from "@/app/_trpc/server-client";

interface CaseIdPageProps {
  params: { caseId: string };
}

export default async function CaseIdPage({ params }: CaseIdPageProps) {
  const ticket = await serverClient.ticket.getTicketById({ id: params.caseId });

  return (
    <div className="flex h-full flex-col gap-y-4 px-2 py-4">
      {ticket.messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          No messages yet.
        </div>
      )}
      {ticket.messages.length > 0 && (
        <ScrollArea className="flex h-[40vh] flex-col md:h-[45vh] lg:h-[77vh] xl:h-[70vh]">
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
